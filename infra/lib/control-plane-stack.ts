import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventTargets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {Construct} from 'constructs';
import {ControlPlaneConfig} from './control-plane-config';

export interface ControlPlaneStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly config: ControlPlaneConfig;
}

export class ControlPlaneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ControlPlaneStackProps) {
    super(scope, id, props);
    const prefix = `/opendds-performance/${props.stage}`;

    const publicBucket = new s3.Bucket(this, 'PublicDashboard', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const artifactBucket = new s3.Bucket(this, 'PrivateArtifacts', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [
        {id: 'builds', prefix: 'builds/', expiration: cdk.Duration.days(30)},
        {id: 'logs', prefix: 'logs/', expiration: cdk.Duration.days(90)},
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const directoryIndex = new cloudfront.Function(this, 'DirectoryIndex', {
      code: cloudfront.FunctionCode.fromInline("function handler(event) { var request = event.request; if (request.uri.endsWith('/')) request.uri += 'index.html'; return request; }"),
    });
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'bench2/index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(publicBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [{
          function: directoryIndex,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
    });

    const vpc = new ec2.Vpc(this, 'TestVpc', {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [{name: 'bench', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24}],
    });
    vpc.addGatewayEndpoint('S3Endpoint', {service: ec2.GatewayVpcEndpointAwsService.S3});
    vpc.addGatewayEndpoint('DynamoEndpoint', {service: ec2.GatewayVpcEndpointAwsService.DYNAMODB});
    const securityGroup = new ec2.SecurityGroup(this, 'BenchSecurityGroup', {vpc, allowAllOutbound: false});
    securityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allUdp(), 'Bench UDP within run subnet');
    securityGroup.addEgressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allUdp(), 'Bench UDP within run subnet');
    securityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTcp(), 'Bench TCP within run subnet');
    securityGroup.addEgressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTcp(), 'Bench TCP within run subnet');
    new ec2.CfnSecurityGroupIngress(this, 'IgmpIngress', {groupId: securityGroup.securityGroupId, ipProtocol: '2', cidrIp: '0.0.0.0/32'});
    new ec2.CfnSecurityGroupEgress(this, 'IgmpEgress', {groupId: securityGroup.securityGroupId, ipProtocol: '2', cidrIp: '224.0.0.0/4'});
    securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS; isolated route table limits this to endpoints');

    const table = new dynamodb.Table(this, 'Runs', {
      partitionKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {pointInTimeRecoveryEnabled: true},
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const coordinator = new lambda.Function(this, 'Coordinator', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'coordinator')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        RUN_TABLE_NAME: table.tableName,
        ARTIFACT_BUCKET: artifactBucket.bucketName,
        PUBLIC_BUCKET: publicBucket.bucketName,
        STAGE: props.stage,
        HARD_BUDGET_USD: '100',
      },
    });
    table.grantReadWriteData(coordinator);
    artifactBucket.grantRead(coordinator);
    publicBucket.grantReadWrite(coordinator);
    coordinator.addToRolePolicy(new iam.PolicyStatement({actions: ['cloudformation:DescribeStacks', 'cloudformation:DeleteStack'], resources: ['*']}));
    new events.Rule(this, 'OrphanReaper', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
      targets: [new eventTargets.LambdaFunction(coordinator, {event: events.RuleTargetInput.fromObject({action: 'reap'})})],
    });

    const buildRole = new iam.Role(this, 'BuildRole', {assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')});
    artifactBucket.grantReadWrite(buildRole);
    table.grantReadWriteData(buildRole);
    buildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCloudFormationFullAccess'));
    buildRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ec2:*', 'autoscaling:*',
        'iam:PassRole', 'iam:GetRole', 'iam:CreateRole', 'iam:DeleteRole',
        'iam:PutRolePolicy', 'iam:DeleteRolePolicy', 'iam:GetRolePolicy',
        'iam:CreateInstanceProfile', 'iam:DeleteInstanceProfile',
        'iam:AddRoleToInstanceProfile', 'iam:RemoveRoleFromInstanceProfile',
        'iam:TagRole', 'ssm:GetParameter', 'ssm:GetParameters',
      ],
      resources: ['*'],
    }));
    buildRole.addToPolicy(new iam.PolicyStatement({actions: ['sts:AssumeRole'], resources: [`arn:${this.partition}:iam::${this.account}:role/cdk-*`]}));

    const image = codebuild.LinuxBuildImage.STANDARD_7_0;
    const buildProject = new codebuild.Project(this, 'BuildOpenDds', {
      role: buildRole,
      environment: {buildImage: image, computeType: codebuild.ComputeType.X2_LARGE},
      timeout: cdk.Duration.hours(2),
      buildSpec: codebuild.BuildSpec.fromObject({version: '0.2', phases: {build: {commands: [
        `git clone --filter=blob:none ${props.config.openDdsRepoUrl} OpenDDS`,
        'cd OpenDDS && git checkout "$OPENDDS_COMMIT" && git submodule update --init --recursive',
        './configure --optimize --no-debug --tests --rapidjson',
        'make -j"$(nproc)" Bench_Worker Bench_node_controller Bench_test_controller Bench_report_parser Bench_dashboard_summarizer DCPSInfoRepo RtpsRelay',
        'export DDS_ROOT="$CODEBUILD_SRC_DIR/OpenDDS"',
        'cd performance-tests/bench && perl install_bench.pl --dest "$CODEBUILD_SRC_DIR/bundle"',
        'cd "$CODEBUILD_SRC_DIR/OpenDDS" && find . -type f -perm -111 \\( -name DCPSInfoRepo -o -name RtpsRelay \\) -exec cp {} "$CODEBUILD_SRC_DIR/bundle/bin/" \\;',
        'find "$CODEBUILD_SRC_DIR/OpenDDS" -type f -name "*.so*" -exec cp -L {} "$CODEBUILD_SRC_DIR/bundle/lib/" \\;',
        'cd "$CODEBUILD_SRC_DIR" && tar -czf bench.tar.gz bundle',
        'aws s3 cp bench.tar.gz "s3://$ARTIFACT_BUCKET/builds/$OPENDDS_COMMIT/bench.tar.gz"',
        `git clone --filter=blob:none ${props.config.nightlyRepoUrl} nightly`,
        'cd nightly && git checkout "$CONFIG_COMMIT"',
        'cd configs/bench && tar -czf "$CODEBUILD_SRC_DIR/config.tar.gz" .',
        'aws s3 cp "$CODEBUILD_SRC_DIR/config.tar.gz" "s3://$ARTIFACT_BUCKET/configs/$CONFIG_COMMIT/config.tar.gz"',
      ]}}}),
      environmentVariables: {ARTIFACT_BUCKET: {value: artifactBucket.bucketName}},
    });

    const infraProject = new codebuild.Project(this, 'ManageRunStack', {
      role: buildRole,
      environment: {buildImage: image, computeType: codebuild.ComputeType.SMALL},
      timeout: cdk.Duration.minutes(30),
      buildSpec: codebuild.BuildSpec.fromObject({version: '0.2', phases: {build: {commands: [
        `git clone --depth 1 --branch ${props.config.dashboardRef} --single-branch ${props.config.dashboardRepoUrl} dashboard`,
        'cd dashboard/infra && npm ci',
        'npx cdk "$CDK_ACTION" "OpenDdsPerformanceRun-*" --require-approval never --force -c runId="$RUN_ID" -c suite="$SUITE" -c commitSha="$OPENDDS_COMMIT" -c configCommit="$CONFIG_COMMIT" -c instanceType="$INSTANCE_TYPE" -c amiId="$AMI_ID" -c availabilityZone="$AVAILABILITY_ZONE" -c artifactKey="builds/$OPENDDS_COMMIT/bench.tar.gz" -c configKey="configs/$CONFIG_COMMIT/config.tar.gz"',
      ]}}}),
    });

    const invoke = (name: string, action: string) => new tasks.LambdaInvoke(this, name, {
      lambdaFunction: coordinator,
      payload: sfn.TaskInput.fromObject({action, 'commitSha.$': '$.commitSha', 'configCommit.$': '$.configCommit', 'suite.$': '$.suite', 'instanceType.$': '$.instanceType', 'amiId.$': '$.amiId', 'availabilityZone.$': '$.availabilityZone', 'topology.$': '$.topology', 'estimatedCostUsd.$': '$.estimatedCostUsd', 'manualOverride.$': '$.manualOverride', 'runId.$': '$.runId'}),
      payloadResponseOnly: true,
    });
    const acquire = new tasks.LambdaInvoke(this, 'Acquire lease and budget', {lambdaFunction: coordinator, payload: sfn.TaskInput.fromObject({action: 'acquire', 'commitSha.$': '$.commitSha', 'configCommit.$': '$.configCommit', 'suite.$': '$.suite', 'instanceType.$': '$.instanceType', 'amiId.$': '$.amiId', 'availabilityZone.$': '$.availabilityZone', 'topology.$': '$.topology', 'estimatedCostUsd.$': '$.estimatedCostUsd', 'manualOverride.$': '$.manualOverride'}), payloadResponseOnly: true});
    const build = new tasks.CodeBuildStartBuild(this, 'Build release bundle', {project: buildProject, integrationPattern: sfn.IntegrationPattern.RUN_JOB, resultPath: sfn.JsonPath.DISCARD, environmentVariablesOverride: {OPENDDS_COMMIT: {value: sfn.JsonPath.stringAt('$.commitSha')}, CONFIG_COMMIT: {value: sfn.JsonPath.stringAt('$.configCommit')}}});
    const deploy = new tasks.CodeBuildStartBuild(this, 'Deploy ephemeral run stack', {project: infraProject, integrationPattern: sfn.IntegrationPattern.RUN_JOB, resultPath: sfn.JsonPath.DISCARD, environmentVariablesOverride: stackEnvironment('deploy')});
    const wait = new sfn.Wait(this, 'Wait for controller', {time: sfn.WaitTime.duration(cdk.Duration.minutes(1))});
    const check = invoke('Check run status', 'status');
    const publish = invoke('Publish dashboard result', 'publish');
    const destroySuccess = new tasks.CodeBuildStartBuild(this, 'Destroy successful run stack', {project: infraProject, integrationPattern: sfn.IntegrationPattern.RUN_JOB, resultPath: sfn.JsonPath.DISCARD, environmentVariablesOverride: stackEnvironment('destroy')});
    const releaseSuccess = invoke('Release successful run lease', 'release');
    const destroyFailure = new tasks.CodeBuildStartBuild(this, 'Destroy failed run stack', {project: infraProject, integrationPattern: sfn.IntegrationPattern.RUN_JOB, resultPath: sfn.JsonPath.DISCARD, environmentVariablesOverride: stackEnvironment('destroy')});
    const releaseFailure = invoke('Release failed run lease', 'release');
    check.next(new sfn.Choice(this, 'Run finished?')
      .when(sfn.Condition.stringEquals('$.runStatus', 'SUCCEEDED'), publish.next(destroySuccess).next(releaseSuccess).next(new sfn.Succeed(this, 'Complete')))
      .when(sfn.Condition.or(sfn.Condition.stringEquals('$.runStatus', 'FAILED'), sfn.Condition.stringEquals('$.runStatus', 'TIMED_OUT')), destroyFailure.next(releaseFailure).next(new sfn.Fail(this, 'Benchmark failed')))
      .otherwise(wait));
    wait.next(check);
    const queuedWait = new sfn.Wait(this, 'Wait for active benchmark', {time: sfn.WaitTime.duration(cdk.Duration.minutes(5))});
    const runRequired = new sfn.Choice(this, 'Run required?')
      .when(sfn.Condition.booleanEquals('$.shouldRun', true), build.next(deploy).next(wait))
      .when(sfn.Condition.stringEquals('$.reason', 'busy'), queuedWait)
      .otherwise(new sfn.Succeed(this, 'Skipped'));
    queuedWait.next(acquire);
    const definition = acquire.next(runRequired);
    const releaseBuildFailure = invoke('Release build failure lease', 'release');
    build.addCatch(releaseBuildFailure.next(new sfn.Fail(this, 'Release build failed')), {resultPath: '$.failure'});
    deploy.addCatch(destroyFailure, {resultPath: '$.failure'});
    check.addCatch(destroyFailure, {resultPath: '$.failure'});
    publish.addCatch(destroyFailure, {resultPath: '$.failure'});
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {definitionBody: sfn.DefinitionBody.fromChainable(definition), timeout: cdk.Duration.hours(12), logs: {destination: new logs.LogGroup(this, 'WorkflowLogs', {retention: logs.RetentionDays.ONE_MONTH}), level: sfn.LogLevel.ERROR}});

    const oidc = new iam.OpenIdConnectProvider(this, 'GitHubOidc', {url: 'https://token.actions.githubusercontent.com', clientIds: ['sts.amazonaws.com']});
    const triggerRole = new iam.Role(this, 'GitHubTriggerRole', {assumedBy: new iam.WebIdentityPrincipal(oidc.openIdConnectProviderArn, {StringEquals: {'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'}, StringLike: {'token.actions.githubusercontent.com:sub': props.config.openDdsOidcSubject}})});
    stateMachine.grantStartExecution(triggerRole);
    const dashboardDeployRole = new iam.Role(this, 'DashboardDeployRole', {assumedBy: new iam.WebIdentityPrincipal(oidc.openIdConnectProviderArn, {StringEquals: {'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'}, StringLike: {'token.actions.githubusercontent.com:sub': props.config.dashboardOidcSubject}})});
    publicBucket.grantReadWrite(dashboardDeployRole);
    dashboardDeployRole.addToPolicy(new iam.PolicyStatement({actions: ['cloudfront:CreateInvalidation'], resources: [distribution.distributionArn]}));

    for (const [name, value] of Object.entries({artifactBucket: artifactBucket.bucketName, publicBucket: publicBucket.bucketName, runTable: table.tableName, vpcId: vpc.vpcId, subnetId: vpc.isolatedSubnets[0].subnetId, routeTableId: vpc.isolatedSubnets[0].routeTable.routeTableId, securityGroupId: securityGroup.securityGroupId})) {
      new ssm.StringParameter(this, `Parameter${name}`, {parameterName: `${prefix}/${name}`, stringValue: value});
    }
    new budgets.CfnBudget(this, 'Budget', {budget: {budgetType: 'COST', timeUnit: 'MONTHLY', budgetLimit: {amount: 100, unit: 'USD'}, budgetName: `OpenDDS Performance ${props.stage}`}});
    new cdk.CfnOutput(this, 'DashboardUrl', {value: `https://${distribution.distributionDomainName}/bench2/`});
    new cdk.CfnOutput(this, 'StateMachineArn', {value: stateMachine.stateMachineArn});
    new cdk.CfnOutput(this, 'GitHubRoleArn', {value: triggerRole.roleArn});
    new cdk.CfnOutput(this, 'DashboardDeployRoleArn', {value: dashboardDeployRole.roleArn});
    new cdk.CfnOutput(this, 'DashboardBucketName', {value: publicBucket.bucketName});
    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {value: distribution.distributionId});

    function stackEnvironment(action: string): Record<string, codebuild.BuildEnvironmentVariable> {
      return {
        CDK_ACTION: {value: action}, RUN_ID: {value: sfn.JsonPath.stringAt('$.runId')}, SUITE: {value: sfn.JsonPath.stringAt('$.suite')}, OPENDDS_COMMIT: {value: sfn.JsonPath.stringAt('$.commitSha')}, CONFIG_COMMIT: {value: sfn.JsonPath.stringAt('$.configCommit')}, INSTANCE_TYPE: {value: sfn.JsonPath.stringAt('$.instanceType')}, AMI_ID: {value: sfn.JsonPath.stringAt('$.amiId')}, AVAILABILITY_ZONE: {value: sfn.JsonPath.stringAt('$.availabilityZone')},
      };
    }
  }
}
