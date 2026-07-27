import * as cdk from 'aws-cdk-lib';

export type Suite = 'validation' | 'standard' | 'core' | 'full';

export interface Topology {
  readonly legCount: number;
  readonly coresPerLeg: number;
}

export interface RunConfig {
  readonly runId: string;
  readonly stackRunId: string;
  readonly commitSha: string;
  readonly configCommit: string;
  readonly suite: Suite;
  readonly topology: Topology;
  readonly instanceType: string;
  readonly amiId: string;
  readonly availabilityZone: string;
  readonly artifactKey: string;
  readonly configKey: string;
  readonly maxRunMinutes: number;
}

export const TOPOLOGIES: Record<Suite, Topology> = {
  validation: {legCount: 3, coresPerLeg: 1},
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
    suite,
    topology,
    instanceType: required(app, 'instanceType'),
    amiId: required(app, 'amiId'),
    availabilityZone: required(app, 'availabilityZone'),
    artifactKey: required(app, 'artifactKey'),
    configKey: required(app, 'configKey'),
    maxRunMinutes: Number(app.node.tryGetContext('maxRunMinutes') ?? 420),
  };
}
