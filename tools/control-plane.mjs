#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import process from 'node:process';
import {
  activeRunStacks, assertSafeToDestroy, auditHasActiveResources, outputMap,
} from './control-plane-lib.mjs';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const infra = resolve(root, 'infra');
const argv = process.argv.slice(2);
const command = argv.shift();

function option(name, fallback) {
  const index = argv.indexOf(`--${name}`);
  return index < 0 ? fallback : argv[index + 1];
}
const flag = name => argv.includes(`--${name}`);
const required = name => {
  const value = option(name);
  if (!value) throw new Error(`missing --${name}`);
  return value;
};
function run(program, args, {json = false, cwd = root, env = {}} = {}) {
  const output = execFileSync(program, args, {
    cwd, env: {...process.env, ...env}, encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'],
  });
  return json ? JSON.parse(output) : output.trim();
}
function repoIdentity(repo) {
  const value = run('gh', ['api', `repos/${repo}`], {json: true});
  return {name: value.full_name, ownerId: value.owner.id, repoId: value.id};
}
function subject(repo, ref) {
  const id = repoIdentity(repo);
  return `repo:${id.name.split('/')[0]}@${id.ownerId}/${id.name.split('/')[1]}@${id.repoId}:ref:refs/heads/${ref}`;
}
function stackOutputs(stack, region) {
  const result = run('aws', ['cloudformation', 'describe-stacks', '--region', region, '--stack-name', stack], {json: true});
  return outputMap(result.Stacks[0]);
}
function audit(stage, region) {
  const stack = `OpenDdsPerformance-${stage}`;
  const described = run('aws', ['cloudformation', 'describe-stacks', '--region', region,
    '--stack-name', stack], {json: true}).Stacks[0];
  const outputs = outputMap(described);
  const executions = run('aws', ['stepfunctions', 'list-executions', '--region', region,
    '--state-machine-arn', outputs.StateMachineArn, '--status-filter', 'RUNNING'], {json: true}).executions;
  const runStacks = activeRunStacks(run('aws', ['cloudformation', 'list-stacks', '--region', region],
    {json: true}).StackSummaries);
  const instances = run('aws', ['ec2', 'describe-instances', '--region', region, '--filters',
    'Name=tag-key,Values=OpenDdsPerformanceRun',
    'Name=instance-state-name,Values=pending,running,stopping,stopped'], {json: true})
    .Reservations.flatMap(({Instances}) => Instances).map(instance => ({
      instanceId: instance.InstanceId, state: instance.State.Name, type: instance.InstanceType,
      runId: instance.Tags?.find(({Key}) => Key === 'OpenDdsPerformanceRun')?.Value,
    }));
  const transitGateways = run('aws', ['ec2', 'describe-transit-gateways', '--region', region,
    '--filters', 'Name=tag-key,Values=OpenDdsPerformanceRun',
    'Name=state,Values=pending,available,modifying,deleting'], {json: true}).TransitGateways
    .map(gateway => ({
      transitGatewayId: gateway.TransitGatewayId, state: gateway.State,
      runId: gateway.Tags?.find(({Key}) => Key === 'OpenDdsPerformanceRun')?.Value,
    }));
  return {
    checkedAt: new Date().toISOString(), stage, region,
    controlPlane: {stack, status: described.StackStatus, dashboardUrl: outputs.DashboardUrl},
    executions, runStacks, instances, transitGateways,
  };
}
function setVariable(repo, name, value) {
  run('gh', ['variable', 'set', name, '--repo', repo, '--body', String(value)]);
  console.log(`set ${repo}: ${name}`);
}
function usage() {
  console.log(`Usage:
  node tools/control-plane.mjs deploy --stage STAGE --region REGION \\
    --opendds-repo OWNER/REPO --opendds-ref BRANCH \\
    --dashboard-repo OWNER/REPO --dashboard-ref BRANCH \\
    [--nightly-repo OWNER/REPO] [--nightly-ref BRANCH]
    [--nightly-oidc-subject SUBJECT]
    [--environment-name NAME] [--nightly-commit FULL_SHA]
    [--availability-zone AZ] [--configure-github]
    [--budget-usd USD] [--budget-email ADDRESS]

  node tools/control-plane.mjs configure-github <same options>
  node tools/control-plane.mjs status --stage STAGE --region REGION [--fail-on-active]
  node tools/control-plane.mjs destroy --stage STAGE --region REGION --yes

Deploy bootstraps CDK and deploys the persistent stack. --configure-github copies
CloudFormation outputs and runtime defaults into GitHub Actions Variables.
Status is read-only; --fail-on-active makes it suitable for an orphan audit.
Destroy refuses to proceed with active executions/run stacks and retains data.`);
}

function settings() {
  const stage = required('stage');
  const region = required('region');
  const openDdsRepo = required('opendds-repo');
  const openDdsRef = required('opendds-ref');
  const dashboardRepo = required('dashboard-repo');
  const dashboardRef = required('dashboard-ref');
  const nightlyRepo = option('nightly-repo', 'OpenDDS/nightly');
  const nightlyRef = option('nightly-ref', 'master');
  return {stage, region, openDdsRepo, openDdsRef, dashboardRepo, dashboardRef, nightlyRepo, nightlyRef};
}

function configure(s, outputs) {
  const ami = option('ami-id') ?? run('aws', ['ssm', 'get-parameter', '--region', s.region,
    '--name', '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64',
    '--query', 'Parameter.Value', '--output', 'text']);
  const az = option('availability-zone', `${s.region}a`);
  const openDds = {
    PERFORMANCE_AWS_ROLE_ARN: outputs.GitHubRoleArn,
    PERFORMANCE_AWS_REGION: s.region,
    PERFORMANCE_STATE_MACHINE_ARN: outputs.StateMachineArn,
    PERFORMANCE_ARTIFACT_BUCKET: outputs.ArtifactBucketName,
    PERFORMANCE_BUNDLE_VERSION: outputs.BundleVersion,
    PERFORMANCE_ENVIRONMENT_NAME: option('environment-name', 'aws-bench-v1'),
    PERFORMANCE_AMI_ID: ami,
    PERFORMANCE_AVAILABILITY_ZONE: az,
    PERFORMANCE_VALIDATION_INSTANCE_TYPE: option('validation-instance-type', 'c7i.large'),
    PERFORMANCE_STANDARD_INSTANCE_TYPE: option('standard-instance-type', 'c7i.xlarge'),
    PERFORMANCE_CORE_INSTANCE_TYPE: option('core-instance-type', 'c7i.2xlarge'),
    PERFORMANCE_FULL_INSTANCE_TYPE: option('full-instance-type', 'c7i.2xlarge'),
  };
  const nightlyCommit = option('nightly-commit');
  if (nightlyCommit) {
    if (!/^[0-9a-f]{40}$/.test(nightlyCommit)) {
      throw new Error('--nightly-commit must be a full lowercase Git commit SHA');
    }
    openDds.PERFORMANCE_NIGHTLY_COMMIT = nightlyCommit;
  }
  const dashboard = {
    AWS_ROLE_ARN: outputs.DashboardDeployRoleArn,
    AWS_REGION: s.region,
    DASHBOARD_BUCKET: outputs.DashboardBucketName,
    CLOUDFRONT_DISTRIBUTION_ID: outputs.CloudFrontDistributionId,
  };
  const nightly = {
    PERFORMANCE_CONFIG_AWS_ROLE_ARN: outputs.ConfigPublisherRoleArn,
    PERFORMANCE_CONFIG_AWS_REGION: s.region,
    PERFORMANCE_CONFIG_ARTIFACT_BUCKET: outputs.ArtifactBucketName,
  };
  for (const [name, value] of Object.entries(openDds)) setVariable(s.openDdsRepo, name, value);
  for (const [name, value] of Object.entries(dashboard)) setVariable(s.dashboardRepo, name, value);
  for (const [name, value] of Object.entries(nightly)) setVariable(s.nightlyRepo, name, value);
}

if (!command || flag('help') || command === 'help') {
  usage();
} else if (command === 'deploy') {
  const s = settings();
  const account = run('aws', ['sts', 'get-caller-identity', '--query', 'Account', '--output', 'text']);
  const stack = `OpenDdsPerformance-${s.stage}`;
  const context = [
    '-c', `stage=${s.stage}`,
    '-c', `openDdsRepoUrl=https://github.com/${s.openDdsRepo}.git`,
    '-c', `nightlyRepoUrl=https://github.com/${s.nightlyRepo}.git`,
    '-c', `dashboardRepoUrl=https://github.com/${s.dashboardRepo}.git`,
    '-c', `dashboardRef=${s.dashboardRef}`,
    '-c', `openDdsOidcSubject=${subject(s.openDdsRepo, s.openDdsRef)}`,
    '-c', `dashboardOidcSubject=${subject(s.dashboardRepo, s.dashboardRef)}`,
    '-c', `nightlyOidcSubject=${option('nightly-oidc-subject') ?? subject(s.nightlyRepo, s.nightlyRef)}`,
    '-c', `budgetUsd=${option('budget-usd', '100')}`,
  ];
  const budgetEmail = option('budget-email');
  if (budgetEmail) context.push('-c', `budgetEmail=${budgetEmail}`);
  const env = {CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: s.region};
  run('npm', ['ci'], {cwd: infra});
  run('npm', ['run', 'build'], {cwd: infra});
  run('npx', ['cdk', 'bootstrap', `aws://${account}/${s.region}`], {cwd: infra, env});
  run('npx', ['cdk', 'deploy', stack, '--require-approval', 'never', ...context], {cwd: infra, env});
  const outputs = stackOutputs(stack, s.region);
  console.log(JSON.stringify(outputs, null, 2));
  if (flag('configure-github')) configure(s, outputs);
} else if (command === 'configure-github') {
  const s = settings();
  configure(s, stackOutputs(`OpenDdsPerformance-${s.stage}`, s.region));
} else if (command === 'status') {
  const result = audit(required('stage'), required('region'));
  console.log(JSON.stringify(result, null, 2));
  if (flag('fail-on-active') && auditHasActiveResources(result)) process.exitCode = 2;
} else if (command === 'destroy') {
  const stage = required('stage');
  const region = required('region');
  if (!flag('yes')) throw new Error('destroy requires --yes');
  const stack = `OpenDdsPerformance-${stage}`;
  const outputs = stackOutputs(stack, region);
  const executions = run('aws', ['stepfunctions', 'list-executions', '--region', region,
    '--state-machine-arn', outputs.StateMachineArn, '--status-filter', 'RUNNING'], {json: true}).executions;
  const stacks = activeRunStacks(run('aws', ['cloudformation', 'list-stacks', '--region', region],
    {json: true}).StackSummaries);
  assertSafeToDestroy(executions, stacks);
  const resources = run('aws', ['cloudformation', 'describe-stack-resources', '--region', region,
    '--stack-name', stack], {json: true}).StackResources;
  const retained = resources.filter(({LogicalResourceId}) =>
    ['PublicDashboard', 'PrivateArtifacts', 'Runs'].some(prefix => LogicalResourceId.startsWith(prefix)));
  const manifest = resolve(infra, '.state', `${stage}-retained.json`);
  mkdirSync(dirname(manifest), {recursive: true});
  writeFileSync(manifest, `${JSON.stringify({stack, region, retained, outputs}, null, 2)}\n`);
  console.log(`recorded retained resources in ${manifest}`);
  run('aws', ['cloudformation', 'delete-stack', '--region', region, '--stack-name', stack]);
  run('aws', ['cloudformation', 'wait', 'stack-delete-complete', '--region', region, '--stack-name', stack]);
  console.log(`deleted ${stack}; retained S3 buckets and DynamoDB table were not erased`);
} else {
  throw new Error(`unknown command: ${command}`);
}
