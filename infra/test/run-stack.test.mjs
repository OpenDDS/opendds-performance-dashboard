import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
require('ts-node/register/transpile-only');
const {
  clockSyncCommands,
  awsDiscoveryConfigCommands,
  multicastGroupDiscoveryCommands,
  multicastReceiverCommands,
  multicastSenderCommands,
  staticMulticastRegistrationCommands,
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

test('relay diagnostic suite captures core dumps on shared storage', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/run-stack.ts'),
    'utf8',
  );
  assert.match(source, /suite === 'relay-diagnostic'/);
  assert.match(source, /kernel\.core_pattern/);
  assert.match(source, /ulimit -c unlimited/);
  assert.match(source, /core-diagnostics/);
});

test('each instance records multicast membership and sequenced packets', () => {
  const commands = multicastReceiverCommands();
  assert.ok(commands.some(command => command.includes('IP_ADD_MEMBERSHIP')));
  assert.ok(commands.some(command => command.includes('/proc/net/igmp')));
  assert.ok(commands.some(command => command.includes('multicast-receive.jsonl')));
});

test('controller measures low, medium, and burst multicast delivery', () => {
  const commands = multicastSenderCommands();
  assert.ok(commands.some(command => command.includes('join-20pps')));
  assert.ok(commands.some(command => command.includes('steady-100pps')));
  assert.ok(commands.some(command => command.includes('burst-1000pps')));
  assert.ok(commands.some(command => command.includes('expected_receivers')));
  assert.ok(commands.some(command => command.includes('1400 - len(message)')));
  assert.ok(!commands.includes('sleep 5'));
});

test('RTPS echo workers enable focused discovery diagnostics', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/run-stack.ts'),
    'utf8',
  );
  assert.match(source, /Enabled focused RTPS discovery diagnostics/);
  assert.match(source, /DCPSTransportDebugLevel/);
  assert.match(source, /prop\.get\("value"\) == "rtps_disc"/);
});

test('all AWS RTPS discovery configurations constrain internal SEDP messages', () => {
  const commands = awsDiscoveryConfigCommands();
  assert.ok(commands.some(command => command.includes('startswith("rtps_discovery/")')));
  assert.ok(commands.some(command => command.includes('"SedpMaxMessageSize", "value": "1400"')));
  assert.ok(commands.some(command => command.includes('os.walk(root)')));
  assert.ok(!commands.some(command => command.includes('SedpResponsiveMode')));
});

test('optional static registration covers OpenDDS data and control multicast groups', () => {
  const discovery = multicastGroupDiscoveryCommands();
  const commands = staticMulticastRegistrationCommands('tgw-mcast-domain');
  assert.ok(discovery.some(command => command.includes('discover_aws_multicast_groups.py')));
  assert.ok(discovery.some(command => command.includes('/opt/opendds-config/config')));
  assert.ok(commands.some(command => command.includes('register-transit-gateway-multicast-group-members')));
  assert.ok(commands.some(command => command.includes('search-transit-gateway-multicast-groups')));
  assert.ok(commands.some(command => command.includes('/tmp/aws-multicast-groups.txt')));
  assert.ok(commands.some(command => command.includes('X-aws-ec2-metadata-token')));
  assert.ok(commands.some(command => command.includes('static-registration-eni.txt')));
});

test('static registration gets temporary private access to the EC2 API', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/run-stack.ts'),
    'utf8',
  );
  assert.match(source, /new ec2\.CfnVPCEndpoint/);
  assert.match(source, /com\.amazonaws\.\$\{this\.region\}\.ec2/);
  assert.match(source, /props\.config\.dynamicMulticastRegistration/);
  assert.match(source, /privateDnsEnabled: true/);
});
