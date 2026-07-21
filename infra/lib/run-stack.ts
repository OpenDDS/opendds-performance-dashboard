import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {Construct} from 'constructs';
import {RunConfig} from './config';

export interface RunStackProps extends cdk.StackProps { readonly config: RunConfig; }

export class RunStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RunStackProps) {
    super(scope, id, props);
    const stage = this.node.tryGetContext('stage') ?? 'dev';
    const prefix = `/opendds-performance/${stage}`;
    const parameter = (name: string) => ssm.StringParameter.valueForStringParameter(this, `${prefix}/${name}`);
    const artifactBucket = s3.Bucket.fromBucketName(this, 'Artifacts', parameter('artifactBucket'));
    const table = dynamodb.Table.fromTableName(this, 'Runs', parameter('runTable'));
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: parameter('vpcId'),
      availabilityZones: [props.config.availabilityZone],
      privateSubnetIds: [parameter('subnetId')],
      privateSubnetRouteTableIds: [parameter('routeTableId')],
    });
    const subnet = ec2.Subnet.fromSubnetAttributes(this, 'Subnet', {
      subnetId: parameter('subnetId'),
      availabilityZone: props.config.availabilityZone,
      routeTableId: parameter('routeTableId'),
    });
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', parameter('securityGroupId'));

    const role = new iam.Role(this, 'InstanceRole', {assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')});
    artifactBucket.grantReadWrite(role, `staging/${props.config.runId}/*`);
    artifactBucket.grantReadWrite(role, `logs/${props.config.runId}/*`);
    artifactBucket.grantRead(role, props.config.artifactKey);
    artifactBucket.grantRead(role, props.config.configKey);
    table.grantReadWriteData(role);
    const profile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {roles: [role.roleName]});

    const placementGroup = new ec2.CfnPlacementGroup(this, 'PlacementGroup', {strategy: 'cluster'});
    const transitGateway = new ec2.CfnTransitGateway(this, 'TransitGateway', {
      multicastSupport: 'enable',
      defaultRouteTableAssociation: 'disable',
      defaultRouteTablePropagation: 'disable',
      tags: runTags(props.config),
    });
    const attachment = new ec2.CfnTransitGatewayVpcAttachment(this, 'VpcAttachment', {
      transitGatewayId: transitGateway.ref,
      vpcId: vpc.vpcId,
      subnetIds: [subnet.subnetId],
      tags: runTags(props.config),
    });
    const multicastDomain = new ec2.CfnTransitGatewayMulticastDomain(this, 'MulticastDomain', {
      transitGatewayId: transitGateway.ref,
      options: {Igmpv2Support: 'enable', StaticSourcesSupport: 'disable', AutoAcceptSharedAssociations: 'disable'},
      tags: runTags(props.config),
    });
    multicastDomain.addDependency(transitGateway);
    const association = new ec2.CfnTransitGatewayMulticastDomainAssociation(this, 'MulticastAssociation', {
      subnetId: subnet.subnetId,
      transitGatewayAttachmentId: attachment.ref,
      transitGatewayMulticastDomainId: multicastDomain.ref,
    });

    const machineImage = ec2.MachineImage.genericLinux({[this.region]: props.config.amiId});
    const ebsKey = kms.Alias.fromAliasName(this, 'EbsKey', 'alias/aws/ebs');
    const fileSystem = new efs.CfnFileSystem(this, 'SharedBenchConfig', {
      encrypted: true,
      throughputMode: 'bursting',
      fileSystemTags: runTags(props.config),
    });
    const mountTarget = new efs.CfnMountTarget(this, 'SharedBenchConfigMount', {
      fileSystemId: fileSystem.ref,
      subnetId: subnet.subnetId,
      securityGroups: [securityGroup.securityGroupId],
    });
    const commonUserData = ec2.UserData.forLinux();
    commonUserData.addCommands(
      'set -euxo pipefail',
      'sysctl -w net.ipv4.conf.all.force_igmp_version=2',
      'sysctl -w net.ipv4.conf.default.force_igmp_version=2',
      'mkdir -p /opt/opendds-bench /opt/opendds-config',
      `for attempt in {1..30}; do mount -t nfs4 -o nfsvers=4.1 ${fileSystem.ref}.efs.${this.region}.amazonaws.com:/ /opt/opendds-config && break; sleep 2; done`,
      'mountpoint -q /opt/opendds-config',
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.artifactKey} /tmp/bench.tar.gz`,
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.configKey} /tmp/config.tar.gz`,
      'tar -xzf /tmp/bench.tar.gz -C /opt/opendds-bench --strip-components=1',
      `flock /opt/opendds-config/.bootstrap.lock -c 'if [ ! -f /opt/opendds-config/.ready-${props.config.configCommit} ]; then tar -xzf /tmp/config.tar.gz -C /opt/opendds-config && touch /opt/opendds-config/.ready-${props.config.configCommit}; fi'`,
      // AWS Transit Gateway drops fragmented multicast IP packets. Keep RTPS
      // messages below the path MTU so OpenDDS fragments large control samples
      // at the RTPS layer instead of relying on IP fragmentation.
      `flock /opt/opendds-config/.control.lock -c "grep -q '^max_message_size=1400$' /opt/opendds-config/control_opendds_config.ini || printf '\nmax_message_size=1400\nheartbeat_period=100\nnak_response_delay=20\nResponsiveMode=1\n' >> /opt/opendds-config/control_opendds_config.ini"`,
      // node_controller's default worker command uses $BENCH_ROOT/worker/worker,
      // while install_bench.pl installs the executable as $BENCH_ROOT/bin/worker.
      // Preserve each worker's inputs and outputs before node_controller removes
      // its per-worker temporary directory. This distinguishes data-plane test
      // failures from failures returning reports over the control domain.
      'mkdir -p /opt/opendds-bench/worker',
      `cat > /opt/opendds-bench/worker/worker <<'WORKER_WRAPPER'
#!/usr/bin/env bash
diagnostic_dir="/opt/opendds-config/worker-diagnostics/${'$'}{HOSTNAME}-${'$'}${'$'}"
mkdir -p "${'$'}diagnostic_dir"
transcript="${'$'}diagnostic_dir/wrapper.log"
config_path="${'$'}{1:-}"
report_path=""
log_path=""
previous=""
for argument in "${'$'}@"; do
  case "${'$'}previous" in
    --report) report_path="${'$'}argument" ;;
    --log) log_path="${'$'}argument" ;;
  esac
  previous="${'$'}argument"
done
printf '%s worker args:' "${'$'}(date -u +%FT%TZ)" >> "${'$'}transcript"
printf ' %q' "${'$'}@" >> "${'$'}transcript"
printf '\n' >> "${'$'}transcript"
cp "${'$'}config_path" "${'$'}diagnostic_dir/config.json" 2>> "${'$'}transcript" || true
# node_controller collects statistics for the PID it spawns.  Preserve that PID
# by replacing this wrapper with the real worker instead of waiting for it as a
# child.  Symlink the worker outputs into the shared diagnostic directory so
# node_controller can remove its temporary names without removing our copies.
if [ -n "${'$'}log_path" ]; then
  touch "${'$'}diagnostic_dir/worker.log"
  ln -sf "${'$'}diagnostic_dir/worker.log" "${'$'}log_path"
fi
if [ -n "${'$'}report_path" ]; then
  touch "${'$'}diagnostic_dir/report.json"
  ln -sf "${'$'}diagnostic_dir/report.json" "${'$'}report_path"
fi
exec /opt/opendds-bench/bin/worker "${'$'}@"
WORKER_WRAPPER`,
      'chmod 755 /opt/opendds-bench/worker/worker',
      'cp /opt/opendds-config/control_opendds_config.ini /opt/opendds-bench/control_opendds_config.ini',
      'export BENCH_ROOT=/opt/opendds-bench',
      'export PATH=$BENCH_ROOT/bin:$PATH',
      'export LD_LIBRARY_PATH=$BENCH_ROOT/lib',
      'export BENCH_CONFIG_DIR=/opt/opendds-config',
    );

    const legUserData = ec2.UserData.custom(commonUserData.render());
    legUserData.addCommands(
      'mkdir -p /opt/opendds-config/node-controller-logs',
      'node_controller_log="/opt/opendds-config/node-controller-logs/${HOSTNAME}.log"',
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-leg-${props.config.stackRunId}-$RANDOM -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > "$node_controller_log" 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      'kill -0 "$node_controller_pid" || { cat "$node_controller_log"; exit 1; }',
    );
    const legLaunchTemplate = new ec2.LaunchTemplate(this, 'LegLaunchTemplate', {
      machineImage,
      instanceType: new ec2.InstanceType(props.config.instanceType),
      role,
      securityGroup,
      userData: legUserData,
      requireImdsv2: true,
      detailedMonitoring: false,
      blockDevices: [{deviceName: '/dev/xvda', volume: ec2.BlockDeviceVolume.ebs(16, {encrypted: true, kmsKey: ebsKey, volumeType: ec2.EbsDeviceVolumeType.GP3})}],
    });
    const cfnLaunchTemplate = legLaunchTemplate.node.defaultChild as ec2.CfnLaunchTemplate;
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.Placement.GroupName', placementGroup.ref);
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.CpuOptions.CoreCount', props.config.topology.coresPerLeg);
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.CpuOptions.ThreadsPerCore', 1);
    const legs = new autoscaling.AutoScalingGroup(this, 'Legs', {
      vpc,
      vpcSubnets: {subnets: [subnet]},
      launchTemplate: legLaunchTemplate,
      minCapacity: props.config.topology.legCount,
      maxCapacity: props.config.topology.legCount,
      healthChecks: autoscaling.HealthChecks.ec2({gracePeriod: cdk.Duration.minutes(10)}),
    });
    cdk.Tags.of(legs).add('OpenDdsPerformanceRun', props.config.runId);

    const controllerUserData = ec2.UserData.custom(commonUserData.render());
    controllerUserData.addCommands(
      `export RUN_ID='${props.config.runId}' SUITE='${props.config.suite}' OPENDDS_COMMIT='${props.config.commitSha}' CONFIG_COMMIT='${props.config.configCommit}'`,
      `export ARTIFACT_BUCKET='${artifactBucket.bucketName}' RUN_TABLE='${table.tableName}' EXPECTED_LEGS='${props.config.topology.legCount}'`,
      'mkdir -p /opt/opendds-config/node-controller-logs',
      'node_controller_log="/opt/opendds-config/node-controller-logs/${HOSTNAME}.log"',
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-controller-${props.config.stackRunId} -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > "$node_controller_log" 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      `kill -0 "$node_controller_pid" || { cat "$node_controller_log"; aws dynamodb update-item --table-name "$RUN_TABLE" --key '{"pk":{"S":"RUN"},"sk":{"S":"${props.config.runId}"}}' --update-expression 'SET #status = :status, errors = :errors' --expression-attribute-names '{"#status":"status"}' --expression-attribute-values '{":status":{"S":"FAILED"},":errors":{"N":"1"}}'; exit 1; }`,
      'sleep 85',
      'set +e',
      '/opt/opendds-config/scripts/run_aws_suite.sh',
      'suite_exit=$?',
      `aws s3 cp /opt/opendds-config/node-controller-logs "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/node-controller-logs" --recursive`,
      `aws s3 cp /opt/opendds-config/worker-diagnostics "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/worker-diagnostics" --recursive`,
      `if [ "$suite_exit" -ne 0 ]; then aws dynamodb update-item --table-name "$RUN_TABLE" --key '{"pk":{"S":"RUN"},"sk":{"S":"${props.config.runId}"}}' --update-expression 'SET #status = :status, errors = :errors' --expression-attribute-names '{"#status":"status"}' --expression-attribute-values '{":status":{"S":"FAILED"},":errors":{"N":"1"}}'; fi`,
      'exit "$suite_exit"',
    );
    const controller = new ec2.CfnInstance(this, 'Controller', {
      imageId: props.config.amiId,
      instanceType: props.config.instanceType,
      subnetId: subnet.subnetId,
      securityGroupIds: [securityGroup.securityGroupId],
      iamInstanceProfile: profile.ref,
      userData: cdk.Fn.base64(controllerUserData.render()),
      metadataOptions: {httpTokens: 'required', httpEndpoint: 'enabled'},
      placementGroupName: placementGroup.ref,
      cpuOptions: {coreCount: props.config.topology.coresPerLeg, threadsPerCore: 1},
      blockDeviceMappings: [{deviceName: '/dev/xvda', ebs: {volumeSize: 16, volumeType: 'gp3', encrypted: true, kmsKeyId: ebsKey.keyArn, deleteOnTermination: true}}],
      tags: [...runTags(props.config), {key: 'Name', value: `opendds-controller-${props.config.stackRunId}`}],
    });
    controller.addDependency(association);
    controller.addDependency(mountTarget);
    controller.addDependency(profile);
    (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(association);
    (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(mountTarget);

    new cdk.CfnOutput(this, 'RunId', {value: props.config.runId});
    new cdk.CfnOutput(this, 'ControllerInstanceId', {value: controller.ref});
  }
}

function runTags(config: RunConfig): cdk.CfnTag[] {
  return [
    {key: 'OpenDdsPerformanceRun', value: config.runId},
    {key: 'OpenDdsCommit', value: config.commitSha},
    {key: 'ExpiresAfterMinutes', value: String(config.maxRunMinutes)},
  ];
}
