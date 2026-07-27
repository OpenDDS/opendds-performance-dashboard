import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeRunStacks, assertSafeToDestroy, auditHasActiveResources, outputMap,
} from '../../tools/control-plane-lib.mjs';

test('CloudFormation outputs are mapped by key', () => {
  assert.deepEqual(outputMap({Outputs: [
    {OutputKey: 'DashboardUrl', OutputValue: 'https://example.invalid/'},
    {OutputKey: 'StateMachineArn', OutputValue: 'arn:example'},
  ]}), {DashboardUrl: 'https://example.invalid/', StateMachineArn: 'arn:example'});
});

test('only non-deleted benchmark stacks are active', () => {
  assert.deepEqual(activeRunStacks([
    {StackName: 'OpenDdsPerformanceRun-one', StackStatus: 'CREATE_COMPLETE'},
    {StackName: 'OpenDdsPerformanceRun-old', StackStatus: 'DELETE_COMPLETE'},
    {StackName: 'OpenDdsPerformance-fork', StackStatus: 'UPDATE_COMPLETE'},
  ]).map(value => value.StackName), ['OpenDdsPerformanceRun-one']);
});

test('destroy guard rejects executions and run stacks', () => {
  assert.doesNotThrow(() => assertSafeToDestroy([], []));
  assert.throws(() => assertSafeToDestroy([{}], []), /1 running execution/);
  assert.throws(() => assertSafeToDestroy([], [{}]), /1 run stack/);
});

test('audit detects any active ephemeral resource', () => {
  const empty = {executions: [], runStacks: [], instances: [], transitGateways: []};
  assert.equal(auditHasActiveResources(empty), false);
  assert.equal(auditHasActiveResources({...empty, instances: [{}]}), true);
});
