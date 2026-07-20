#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {ControlPlaneStack} from '../lib/control-plane-stack';
import {RunStack} from '../lib/run-stack';
import {loadRunConfig} from '../lib/config';
import {loadControlPlaneConfig} from '../lib/control-plane-config';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') ?? 'dev';
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

if (app.node.tryGetContext('runId')) {
  const config = loadRunConfig(app);
  new RunStack(app, `OpenDdsPerformanceRun-${config.stackRunId}`, {
    env,
    description: `Ephemeral OpenDDS Bench environment for ${config.runId}`,
    config,
  });
} else {
  new ControlPlaneStack(app, `OpenDdsPerformance-${stage}`, {
    env,
    description: 'OpenDDS performance test control plane and dashboard hosting',
    stage,
    config: loadControlPlaneConfig(app),
  });
}
