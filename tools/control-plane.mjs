#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import process from 'node:process';

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
  return Object.fromEntries(result.Stacks[0].Outputs.map(({OutputKey, OutputValue}) => [OutputKey, OutputValue]));
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
    [--nightly-repo OWNER/REPO] [--availability-zone AZ] [--configure-github]

  node tools/control-plane.mjs configure-github <same options>
  node tools/control-plane.mjs destroy --stage STAGE --region REGION --yes

Deploy bootstraps CDK and deploys the persistent stack. --configure-github copies
CloudFormation outputs and runtime defaults into GitHub Actions Variables.
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
  return {stage, region, openDdsRepo, openDdsRef, dashboardRepo, dashboardRef, nightlyRepo};
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
    PERFORMANCE_AMI_ID: ami,
    PERFORMANCE_AVAILABILITY_ZONE: az,
    PERFORMANCE_VALIDATION_INSTANCE_TYPE: option('validation-instance-type', 'c7i.large'),
    PERFORMANCE_CORE_INSTANCE_TYPE: option('core-instance-type', 'c7i.2xlarge'),
    PERFORMANCE_FULL_INSTANCE_TYPE: option('full-instance-type', 'c7i.2xlarge'),
  };
  const dashboard = {
    AWS_ROLE_ARN: outputs.DashboardDeployRoleArn,
    AWS_REGION: s.region,
    DASHBOARD_BUCKET: outputs.DashboardBucketName,
    CLOUDFRONT_DISTRIBUTION_ID: outputs.CloudFrontDistributionId,
  };
  for (const [name, value] of Object.entries(openDds)) setVariable(s.openDdsRepo, name, value);
  for (const [name, value] of Object.entries(dashboard)) setVariable(s.dashboardRepo, name, value);
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
  ];
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
} else if (command === 'destroy') {
  const stage = required('stage');
  const region = required('region');
  if (!flag('yes')) throw new Error('destroy requires --yes');
  const stack = `OpenDdsPerformance-${stage}`;
  const outputs = stackOutputs(stack, region);
  const executions = run('aws', ['stepfunctions', 'list-executions', '--region', region,
    '--state-machine-arn', outputs.StateMachineArn, '--status-filter', 'RUNNING'], {json: true}).executions;
  const stacks = run('aws', ['cloudformation', 'list-stacks', '--region', region], {json: true}).StackSummaries
    .filter(value => value.StackName.startsWith('OpenDdsPerformanceRun-') && value.StackStatus !== 'DELETE_COMPLETE');
  if (executions.length || stacks.length) {
    throw new Error(`refusing destroy: ${executions.length} running execution(s), ${stacks.length} run stack(s)`);
  }
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
