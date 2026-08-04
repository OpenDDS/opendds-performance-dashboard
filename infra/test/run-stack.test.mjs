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
  networkScenarioSummaryCommands,
  staticMulticastRegistrationCommands,
  udpBufferTuningCommands,
} = require('../lib/run-stack.ts');

test('UDP socket tuning leaves headroom above OpenDDS buffer requests', () => {
  const commands = udpBufferTuningCommands();
  assert.ok(commands.includes('sysctl -w net.core.rmem_max=16777216'));
  assert.ok(commands.includes('sysctl -w net.core.wmem_max=16777216'));
  assert.ok(commands.includes('sysctl -w net.core.rmem_default=4194304'));
  assert.ok(commands.includes('sysctl -w net.core.wmem_default=4194304'));
});

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
  assert.ok(commands.some(command => command.includes('/proc/net/igmp')));
  assert.ok(commands.some(command => command.includes('socket-buffer-sysctls.txt')));
  assert.ok(commands.some(command => command.includes('ss -u -a -n -m -p')));
  const receiver = require('node:fs').readFileSync(
    require.resolve('../scripts/multicast_receiver.py'),
    'utf8',
  );
  assert.match(receiver, /IP_ADD_MEMBERSHIP/);
  assert.match(receiver, /multicast-receive\.jsonl/);
  const monitor = require('node:fs').readFileSync(
    require.resolve('../scripts/host_network_monitor.py'),
    'utf8',
  );
  assert.match(monitor, /host-network-counters\.jsonl/);
  assert.match(monitor, /\/proc\/net\/softnet_stat/);
  assert.match(monitor, /rx_dropped/);
});

test('control-plane RTPS transport requests explicit UDP buffers', () => {
  const source = require('node:fs').readFileSync(
    require.resolve('../lib/run-stack.ts'),
    'utf8',
  );
  assert.match(source, /send_buffer_size=4194304/);
  assert.match(source, /rcv_buffer_size=4194304/);
});

test('network diagnostics summarize host counter deltas by scenario', () => {
  const commands = networkScenarioSummaryCommands();
  assert.ok(commands.includes('python3 /tmp/summarize-opendds-network.py'));
  const summary = require('node:fs').readFileSync(
    require.resolve('../scripts/summarize_network.py'),
    'utf8',
  );
  assert.match(summary, /controller-diagnostics/);
  assert.match(summary, /host-network-counters\.jsonl/);
  assert.match(summary, /RcvbufErrors/);
  assert.match(summary, /scenario-network-summary\.json/);
});

test('controller measures low, medium, and burst multicast delivery', () => {
  const commands = multicastSenderCommands();
  assert.ok(commands.some(command => command.includes('expected_receivers')));
  assert.ok(!commands.includes('sleep 5'));
  const sender = require('node:fs').readFileSync(
    require.resolve('../scripts/multicast_sender.py'),
    'utf8',
  );
  assert.match(sender, /join-20pps/);
  assert.match(sender, /steady-100pps/);
  assert.match(sender, /burst-1000pps/);
  assert.match(sender, /1400 - len\(message\)/);
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
  assert.deepEqual(awsDiscoveryConfigCommands(), []);
  const script = require('node:fs').readFileSync(
    require.resolve('../scripts/configure_aws_discovery.py'),
    'utf8',
  );
  assert.match(script, /startswith\("rtps_discovery\/"\)/);
  assert.match(script, /"SedpMaxMessageSize", "value": "1400"/);
  assert.match(script, /os\.walk\(root\)/);
  assert.doesNotMatch(script, /SedpResponsiveMode/);
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
