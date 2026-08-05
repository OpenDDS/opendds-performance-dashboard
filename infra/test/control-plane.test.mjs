import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
import {
  activeRunStacks, assertSafeToDestroy, auditHasActiveResources, outputMap,
} from '../../tools/control-plane-lib.mjs';

const require = createRequire(import.meta.url);

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

test('run-stack teardown does not require a nightly config checkout', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/control-plane-stack.ts'),
    'utf8',
  );
  assert.match(source, /if \[ "\$CDK_ACTION" = deploy \]; then if aws s3api head-object/);
});

test('nightly publisher is restricted to immutable config objects', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/control-plane-stack.ts'),
    'utf8',
  );
  assert.match(source, /ConfigPublisherRole/);
  assert.match(source, /actions: \['s3:GetObject', 's3:PutObject'\]/);
  assert.match(source, /arnForObjects\('configs\/\*'\)/);
  assert.doesNotMatch(source, /ConfigPublisherRole[\s\S]{0,500}s3:DeleteObject/);
});

test('named environments are carried through orchestration without replacing the exact hash', () => {
  const source = require('node:fs').readFileSync(require.resolve('../lib/control-plane-stack.ts'), 'utf8');
  const coordinator = require('node:fs').readFileSync(require.resolve('../lambda/coordinator/index.mjs'), 'utf8');
  assert.match(source, /'environmentName\.\$': '\$\.environmentName'/);
  assert.match(source, /ENVIRONMENT_NAME: \{value: sfn\.JsonPath\.stringAt\('\$\.environmentName'\)\}/);
  assert.match(coordinator, /environmentName: input\.environmentName/);
  const hashInput = coordinator.match(/const environmentHash = input =>([\s\S]*?)\.digest\('hex'\)/)?.[1] ?? '';
  assert.notEqual(hashInput, '');
  assert.doesNotMatch(hashInput, /environmentName/);
});
