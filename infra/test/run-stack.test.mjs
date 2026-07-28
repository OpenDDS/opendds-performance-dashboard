import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
require('ts-node/register/transpile-only');
const {clockSyncCommands} = require('../lib/run-stack.ts');

test('instances must synchronize their clocks before starting Bench', () => {
  const commands = clockSyncCommands();
  assert.ok(commands.includes('systemctl enable --now chronyd'));
  assert.ok(commands.includes(
    'chronyc waitsync 120 0.001 0 0.5 | tee "$clock_evidence_dir/waitsync.txt"',
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
