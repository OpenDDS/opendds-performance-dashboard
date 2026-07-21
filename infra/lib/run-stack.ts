import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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
    const commonUserData = ec2.UserData.forLinux();
    commonUserData.addCommands(
      'set -euxo pipefail',
      'sysctl -w net.ipv4.conf.all.force_igmp_version=2',
      'sysctl -w net.ipv4.conf.default.force_igmp_version=2',
      'mkdir -p /opt/opendds-bench /opt/opendds-config',
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.artifactKey} /tmp/bench.tar.gz`,
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.configKey} /tmp/config.tar.gz`,
      'tar -xzf /tmp/bench.tar.gz -C /opt/opendds-bench --strip-components=1',
      'tar -xzf /tmp/config.tar.gz -C /opt/opendds-config',
      'cp /opt/opendds-config/control_opendds_config.ini /opt/opendds-bench/control_opendds_config.ini',
      'export BENCH_ROOT=/opt/opendds-bench',
      'export PATH=$BENCH_ROOT/bin:$PATH',
      'export LD_LIBRARY_PATH=$BENCH_ROOT/lib',
      'export BENCH_CONFIG_DIR=/opt/opendds-config',
    );

    const legUserData = ec2.UserData.custom(commonUserData.render());
    legUserData.addCommands(
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-leg-${props.config.stackRunId}-$RANDOM -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > /tmp/node-controller.log 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      'kill -0 "$node_controller_pid" || { cat /tmp/node-controller.log; exit 1; }',
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
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-controller-${props.config.stackRunId} -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > /tmp/node-controller.log 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      `kill -0 "$node_controller_pid" || { cat /tmp/node-controller.log; aws dynamodb update-item --table-name "$RUN_TABLE" --key '{"pk":{"S":"RUN"},"sk":{"S":"${props.config.runId}"}}' --update-expression 'SET #status = :status, errors = :errors' --expression-attribute-names '{"#status":"status"}' --expression-attribute-values '{":status":{"S":"FAILED"},":errors":{"N":"1"}}'; exit 1; }`,
      'sleep 85',
      '/opt/opendds-config/scripts/run_aws_suite.sh',
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
    controller.addDependency(profile);
    (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(association);

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
