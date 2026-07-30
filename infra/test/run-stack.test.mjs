import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
require('ts-node/register/transpile-only');
const {
  clockSyncCommands,
  multicastReceiverCommands,
  multicastSenderCommands,
} = require('../lib/run-stack.ts');

test('instances must synchronize their clocks before starting Bench', () => {
  const commands = clockSyncCommands();
  assert.ok(commands.includes('systemctl enable --now chronyd'));
  assert.ok(commands.includes(
    'chronyc waitsync 240 0.001 100 0.5 | tee "$clock_evidence_dir/waitsync.txt"',
  ));
  assert.ok(commands.some(command =>
    command.includes('$2 == "169.254.169.123"'),
  ));
});

test('clock synchronization evidence records source and measured offset', () => {
  const commands = clockSyncCommands();
  assert.ok(commands.some(command => command.includes('tracking-after.txt')));
  assert.ok(commands.some(command => command.includes('sources-after.txt')));
  assert.ok(commands.some(command => command.includes('timedatectl.txt')));
});

test('run stack samples clock state throughout benchmark execution', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/run-stack.ts'),
    'utf8',
  );
  assert.match(source, /clock_monitor_log/);
  assert.match(source, /sleep 30/);
});

test('each instance records multicast membership and sequenced packets', () => {
  const commands = multicastReceiverCommands();
  assert.ok(commands.some(command => command.includes('IP_ADD_MEMBERSHIP')));
  assert.ok(commands.some(command => command.includes('/proc/net/igmp')));
  assert.ok(commands.some(command => command.includes('multicast-receive.jsonl')));
});

test('controller measures low, medium, and burst multicast delivery', () => {
  const commands = multicastSenderCommands();
  assert.ok(commands.some(command => command.includes('warmup-10pps')));
  assert.ok(commands.some(command => command.includes('steady-100pps')));
  assert.ok(commands.some(command => command.includes('burst-1000pps')));
  assert.ok(commands.some(command => command.includes('expected_receivers')));
  assert.ok(commands.some(command => command.includes('1400 - len(message)')));
});
