import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
require('ts-node/register/transpile-only');
const cdk = require('aws-cdk-lib');
const {loadControlPlaneConfig} = require('../lib/control-plane-config.ts');
const {TOPOLOGIES} = require('../lib/config.ts');

test('documented topology profiles remain below the multicast ceiling', () => {
  for (const topology of Object.values(TOPOLOGIES)) assert.ok(topology.legCount + 1 <= 100);
});

test('validation uses one physical core per inexpensive smoke-test instance', () => {
  assert.deepEqual(TOPOLOGIES.validation, {legCount: 3, coresPerLeg: 1});
});

test('the unsupported 120-leg topology exceeds the multicast ceiling', () => {
  assert.ok(120 + 1 > 100);
});

test('fork repository URLs and immutable OIDC subjects are accepted', () => {
  const app = new cdk.App({context: {
    openDdsRepoUrl: 'https://github.com/simpsont-oci/OpenDDS.git',
    dashboardRepoUrl: 'https://github.com/simpsont-oci/opendds-performance-dashboard.git',
    dashboardRef: 'aws-performance-testing',
    openDdsOidcSubject: 'repo:simpsont-oci@32278075/OpenDDS@1307039839:*',
    dashboardOidcSubject: 'repo:simpsont-oci@32278075/opendds-performance-dashboard@1307044731:ref:refs/heads/aws-performance-testing',
  }});
  const config = loadControlPlaneConfig(app);
  assert.equal(config.nightlyRepoUrl, 'https://github.com/OpenDDS/nightly.git');
  assert.equal(config.dashboardRef, 'aws-performance-testing');
});

test('repository contexts reject shell metacharacters', () => {
  const app = new cdk.App({context: {openDdsRepoUrl: 'https://github.com/example/repo.git; echo unsafe'}});
  assert.throws(() => loadControlPlaneConfig(app), /HTTPS github.com repository URL/);
});
