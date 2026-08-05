import * as cdk from 'aws-cdk-lib';

export type Suite =
  | 'validation'
  | 'large-message'
  | 'relay-diagnostic'
  | 'fan-diagnostic'
  | 'standard'
  | 'core'
  | 'full';

export interface Topology {
  readonly legCount: number;
  readonly coresPerLeg: number;
}

export interface RunConfig {
  readonly runId: string;
  readonly stackRunId: string;
  readonly commitSha: string;
  readonly configCommit: string;
  readonly environmentName: string;
  readonly suite: Suite;
  readonly topology: Topology;
  readonly instanceType: string;
  readonly amiId: string;
  readonly availabilityZone: string;
  readonly artifactKey: string;
  readonly configKey: string;
  readonly dynamicMulticastRegistration: boolean;
  readonly maxRunMinutes: number;
}

export const TOPOLOGIES: Record<Suite, Topology> = {
  validation: {legCount: 3, coresPerLeg: 1},
  'large-message': {legCount: 3, coresPerLeg: 1},
  'relay-diagnostic': {legCount: 3, coresPerLeg: 1},
  'fan-diagnostic': {legCount: 12, coresPerLeg: 4},
  standard: {legCount: 6, coresPerLeg: 2},
  core: {legCount: 12, coresPerLeg: 4},
  full: {legCount: 30, coresPerLeg: 4},
};

function required(app: cdk.App, name: string): string {
  const value = app.node.tryGetContext(name);
  if (!value || typeof value !== 'string') {
    throw new Error(`Missing required CDK context value: ${name}`);
  }
  return value;
}

function booleanContext(app: cdk.App, name: string): boolean {
  const value = app.node.tryGetContext(name);
  if (value === undefined || value === false || value === 'false') return false;
  if (value === true || value === 'true') return true;
  throw new Error(`${name} must be true or false`);
}

export function stackSafeRunId(runId: string): string {
  const safe = runId.replace(/[^A-Za-z0-9-]/g, '-').replace(/^-+|-+$/g, '');
  if (!safe) throw new Error('runId must contain at least one letter or number');
  return safe.slice(0, 48);
}

export function loadRunConfig(app: cdk.App): RunConfig {
  const suite = required(app, 'suite') as Suite;
  if (!(suite in TOPOLOGIES)) throw new Error(`Unsupported suite: ${suite}`);
  const runId = required(app, 'runId');
  const topology = TOPOLOGIES[suite];
  if (topology.legCount + 1 > 100) {
    throw new Error('Controller plus leg count exceeds the AWS multicast member limit');
  }

  return {
    runId,
    stackRunId: stackSafeRunId(runId),
    commitSha: required(app, 'commitSha'),
    configCommit: required(app, 'configCommit'),
    environmentName: required(app, 'environmentName'),
    suite,
    topology,
    instanceType: required(app, 'instanceType'),
    amiId: required(app, 'amiId'),
    availabilityZone: required(app, 'availabilityZone'),
    artifactKey: required(app, 'artifactKey'),
    configKey: required(app, 'configKey'),
    dynamicMulticastRegistration: booleanContext(app, 'dynamicMulticastRegistration'),
    maxRunMinutes: Number(app.node.tryGetContext('maxRunMinutes') ?? 420),
  };
}
