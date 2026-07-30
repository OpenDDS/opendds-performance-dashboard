import assert from 'node:assert/strict';
import test from 'node:test';
import {
  requiredFleetVcpus,
  STANDARD_ON_DEMAND_QUOTA_CODE,
} from '../lambda/coordinator/quota.mjs';

test('quota preflight includes the controller and uses default instance vCPUs', () => {
  assert.equal(requiredFleetVcpus(4, {legCount: 6, coresPerLeg: 2}), 28);
  assert.equal(requiredFleetVcpus(8, {legCount: 12, coresPerLeg: 4}), 104);
  assert.equal(requiredFleetVcpus(8, {legCount: 30, coresPerLeg: 4}), 248);
});

test('quota preflight uses the adjustable On-Demand Standard quota', () => {
  assert.equal(STANDARD_ON_DEMAND_QUOTA_CODE, 'L-1216C47A');
});

test('quota preflight rejects invalid capacity inputs', () => {
  assert.throws(() => requiredFleetVcpus(undefined, {legCount: 6}), /Invalid instance/);
  assert.throws(() => requiredFleetVcpus(4, {legCount: 0}), /Invalid leg count/);
});
