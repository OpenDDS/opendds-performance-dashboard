import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {Construct} from 'constructs';
import {RunConfig} from './config';

export interface RunStackProps extends cdk.StackProps { readonly config: RunConfig; }

export function udpBufferTuningCommands(): string[] {
  return [
    // Keep the kernel ceiling above OpenDDS's 4 MiB socket requests. Linux can
    // otherwise accept SO_RCVBUF/SO_SNDBUF while silently clamping the value.
    'sysctl -w net.core.rmem_max=16777216',
    'sysctl -w net.core.wmem_max=16777216',
    'sysctl -w net.core.rmem_default=4194304',
    'sysctl -w net.core.wmem_default=4194304',
  ];
}

export function clockSyncCommands(): string[] {
  return [
    'clock_evidence_dir=/tmp/opendds-clock-diagnostics',
    'mkdir -p "$clock_evidence_dir"',
    'systemctl enable --now chronyd',
    'chronyc tracking | tee "$clock_evidence_dir/tracking-before.txt"',
    'chronyc sources -v | tee "$clock_evidence_dir/sources-before.txt"',
    // Try twice per second for two minutes. Require both a system-clock
    // correction of at most 1 ms and a settled frequency-skew estimate of at
    // most 100 ppm before any Bench process can start.
    'chronyc waitsync 240 0.001 100 0.5 | tee "$clock_evidence_dir/waitsync.txt"',
    `chronyc sources -n | awk '$1 == "^*" && $2 == "169.254.169.123" { found=1 } END { exit !found }'`,
    'chronyc tracking | tee "$clock_evidence_dir/tracking-after.txt"',
    'chronyc sources -v | tee "$clock_evidence_dir/sources-after.txt"',
    'timedatectl show --all > "$clock_evidence_dir/timedatectl.txt"',
    'systemctl status --no-pager chronyd > "$clock_evidence_dir/chronyd-status.txt"',
  ];
}

export function multicastReceiverCommands(): string[] {
  return [
    'network_evidence_dir="/opt/opendds-config/network-diagnostics/$HOSTNAME"',
    'mkdir -p "$network_evidence_dir"',
    `cat > /tmp/opendds-host-network-monitor.py <<'PY'
import json
import os
import time


def protocol_counters(path):
    result = {}
    with open(path) as stream:
        lines = [line.split() for line in stream]
    for names, values in zip(lines[0::2], lines[1::2]):
        if names and values and names[0] == values[0]:
            result.update({names[0].rstrip(":") + name: int(value)
                           for name, value in zip(names[1:], values[1:])})
    return result


def interface_counters():
    result = {}
    fields = ("rx_dropped", "rx_errors", "tx_dropped", "tx_errors")
    for interface in os.listdir("/sys/class/net"):
        if interface == "lo":
            continue
        for field in fields:
            path = "/sys/class/net/%s/statistics/%s" % (interface, field)
            with open(path) as stream:
                result["interface_%s_%s" % (interface, field)] = int(stream.read())
    return result


def softnet_counters():
    processed = dropped = time_squeeze = 0
    with open("/proc/net/softnet_stat") as stream:
        for line in stream:
            fields = line.split()
            processed += int(fields[0], 16)
            dropped += int(fields[1], 16)
            time_squeeze += int(fields[2], 16)
    return {"softnet_processed": processed, "softnet_dropped": dropped,
            "softnet_time_squeeze": time_squeeze}


output = os.path.join(os.environ["network_evidence_dir"], "host-network-counters.jsonl")
with open(output, "a", buffering=1) as stream:
    while True:
        counters = {"wall_ns": time.time_ns(), "monotonic_ns": time.monotonic_ns()}
        counters.update(protocol_counters("/proc/net/snmp"))
        counters.update(protocol_counters("/proc/net/netstat"))
        counters.update(interface_counters())
        counters.update(softnet_counters())
        stream.write(json.dumps(counters, separators=(",", ":")) + "\\n")
        time.sleep(5)
PY`,
    `cat > /tmp/opendds-multicast-receiver.py <<'PY'
import json
import os
import socket
import struct
import time

group = "239.255.42.99"
port = 45999
host = socket.gethostname()
output = os.path.join(os.environ["network_evidence_dir"], "multicast-receive.jsonl")
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(("", port))
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP,
                struct.pack("=4s4s", socket.inet_aton(group), socket.inet_aton("0.0.0.0")))
with open(output, "a", buffering=1) as stream:
    stream.write(json.dumps({"event": "joined", "host": host, "wall_ns": time.time_ns(),
                             "monotonic_ns": time.monotonic_ns(), "group": group, "port": port}) + "\\n")
    while True:
        payload, address = sock.recvfrom(65535)
        received_ns = time.time_ns()
        try:
            message = json.loads(payload.rstrip(b" ").decode())
        except Exception as error:
            message = {"decode_error": str(error), "payload_size": len(payload)}
        message.update({"event": "received", "receiver": host, "source": address[0],
                        "received_ns": received_ns, "payload_size": len(payload)})
        stream.write(json.dumps(message, separators=(",", ":")) + "\\n")
PY`,
    'export network_evidence_dir',
    'nohup python3 /tmp/opendds-multicast-receiver.py > "$network_evidence_dir/receiver.stdout" 2>&1 &',
    'echo "$!" > "$network_evidence_dir/receiver.pid"',
    'for attempt in {1..20}; do grep -q \'"event": "joined"\' "$network_evidence_dir/multicast-receive.jsonl" 2>/dev/null && break; sleep 0.25; done',
    'grep -q \'"event": "joined"\' "$network_evidence_dir/multicast-receive.jsonl"',
    'cat /proc/net/igmp > "$network_evidence_dir/igmp-after-join.txt"',
    'ip maddr show > "$network_evidence_dir/maddr-after-join.txt"',
    'sysctl net.core.rmem_max net.core.wmem_max net.core.rmem_default net.core.wmem_default > "$network_evidence_dir/socket-buffer-sysctls.txt"',
    'nstat -az > "$network_evidence_dir/nstat-before.txt" 2>&1 || true',
    `nohup bash -c 'while true; do date -u +%FT%TZ; cat /proc/net/igmp; ip maddr show; nstat -az; sleep 5; done' > "$network_evidence_dir/network-monitor.log" 2>&1 &`,
    // ss -m exposes the effective receive/send buffer limits (rb/tb) granted
    // to each UDP socket, not merely the values requested by its application.
    `nohup bash -c 'while true; do date -u +%FT%TZ; ss -u -a -n -m -p; sleep 5; done' > "$network_evidence_dir/socket-monitor.log" 2>&1 &`,
    'nohup python3 /tmp/opendds-host-network-monitor.py > "$network_evidence_dir/host-network-monitor.stdout" 2>&1 &',
  ];
}

export function multicastSenderCommands(): string[] {
  return [
    `cat > /tmp/opendds-multicast-sender.py <<'PY'
import json
import os
import socket
import time

group = "239.255.42.99"
port = 45999
output = "/opt/opendds-config/network-diagnostics/multicast-send.jsonl"
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_LOOP, 1)
profiles = (("join-20pps", 100, 0.05), ("steady-100pps", 1000, 0.01),
            ("burst-1000pps", 5000, 0.001))
with open(output, "w", buffering=1) as stream:
    stream.write(json.dumps({"event": "sender-started", "sent_ns": time.time_ns()},
                            separators=(",", ":")) + "\\n")
    for profile, count, interval in profiles:
        for sequence in range(count):
            sent_ns = time.time_ns()
            message = json.dumps({"profile": profile, "sequence": sequence,
                                  "sent_ns": sent_ns}, separators=(",", ":")).encode()
            payload = message + b" " * (1400 - len(message))
            sock.sendto(payload, (group, port))
            stream.write(json.dumps({"profile": profile, "sequence": sequence,
                                     "sent_ns": sent_ns, "payload_size": len(payload)},
                                    separators=(",", ":")) + "\\n")
            target = sent_ns + int(interval * 1_000_000_000)
            while time.time_ns() < target:
                time.sleep(min(interval / 4, 0.001))
        time.sleep(2)
PY`,
    // Start as soon as every local socket reports its join. This intentionally
    // measures Transit Gateway IGMP convergence instead of hiding it behind a
    // settling delay.
    'expected_receivers=$((EXPECTED_LEGS + 1))',
    'for attempt in {1..180}; do joined_receivers="$(find /opt/opendds-config/network-diagnostics -name multicast-receive.jsonl -exec grep -l \'"event": "joined"\' {} \\; | wc -l)"; [[ "$joined_receivers" -ge "$expected_receivers" ]] && break; sleep 0.5; done',
    '[[ "${joined_receivers:-0}" -ge "$expected_receivers" ]]',
    'python3 /tmp/opendds-multicast-sender.py',
    'sleep 2',
    'cat /proc/net/igmp > "$network_evidence_dir/igmp-after-send.txt"',
    'ip maddr show > "$network_evidence_dir/maddr-after-send.txt"',
    'nstat -az > "$network_evidence_dir/nstat-after-send.txt" 2>&1 || true',
  ];
}

export function networkScenarioSummaryCommands(): string[] {
  return [
    `cat > /tmp/summarize-opendds-network.py <<'PY'
import datetime
import glob
import json
import os
import re

root = "/opt/opendds-config"
diagnostics = os.path.join(root, "network-diagnostics")
scenarios = []
for path in glob.glob(os.path.join(root, "result", "controller-diagnostics", "*.log")):
    with open(path) as stream:
        text = stream.read()
    started = re.search(r"^Started at (\\S+)", text, re.MULTILINE)
    ended = re.search(r"^Ended at (\\S+)", text, re.MULTILINE)
    if started and ended:
        to_ns = lambda value: int(datetime.datetime.fromisoformat(
            value.replace("Z", "+00:00")).timestamp() * 1_000_000_000)
        scenarios.append((os.path.basename(path)[:-4], to_ns(started.group(1)),
                          to_ns(ended.group(1))))

interesting = re.compile(
    r"^(Udp(InErrors|RcvbufErrors|SndbufErrors|MemErrors)|"
    r"Ip(InDiscards|OutDiscards|ReasmFails|FragFails)|"
    r"softnet_(dropped|time_squeeze)|interface_.*_(dropped|errors))$")
summary = {"sampling_interval_seconds": 5, "scenarios": {}}
for scenario, started_ns, ended_ns in scenarios:
    hosts = {}
    for path in glob.glob(os.path.join(diagnostics, "*", "host-network-counters.jsonl")):
        with open(path) as stream:
            samples = [json.loads(line) for line in stream if line.strip()]
        before = next((sample for sample in reversed(samples)
                       if sample["wall_ns"] <= started_ns), None)
        after = next((sample for sample in samples
                      if sample["wall_ns"] >= ended_ns), None)
        if not before or not after:
            continue
        delta = {key: after[key] - before.get(key, 0) for key in after
                 if interesting.match(key) and after[key] - before.get(key, 0)}
        hosts[os.path.basename(os.path.dirname(path))] = {
            "sample_start_ns": before["wall_ns"],
            "sample_end_ns": after["wall_ns"],
            "delta": delta,
        }
    summary["scenarios"][scenario] = {
        "started_ns": started_ns, "ended_ns": ended_ns, "hosts": hosts}

with open(os.path.join(diagnostics, "scenario-network-summary.json"), "w") as stream:
    json.dump(summary, stream, indent=2, sort_keys=True)
PY`,
    'python3 /tmp/summarize-opendds-network.py',
  ];
}

export function awsDiscoveryConfigCommands(): string[] {
  return [
    `cat > /tmp/configure-aws-discovery.py <<'PY'
import json
import os
import sys

root = sys.argv[1]
changed_files = 0
changed_sections = 0
for directory, _, filenames in os.walk(root):
    for filename in filenames:
        if not filename.endswith(".json"):
            continue
        path = os.path.join(directory, filename)
        try:
            with open(path) as stream:
                config = json.load(stream)
        except (OSError, ValueError):
            continue
        changed = False
        for section in config.get("process", {}).get("config_sections", []):
            if not section.get("name", "").startswith("rtps_discovery/"):
                continue
            section_changed = False
            properties = section.setdefault("properties", [])
            sedp_max = next(
                (prop for prop in properties if prop.get("name") == "SedpMaxMessageSize"),
                None,
            )
            if sedp_max is None:
                properties.append({"name": "SedpMaxMessageSize", "value": "1400"})
                changed = True
                section_changed = True
            elif sedp_max.get("value") != "1400":
                sedp_max["value"] = "1400"
                changed = True
                section_changed = True
            if section_changed:
                changed_sections += 1
        if changed:
            with open(path, "w") as stream:
                json.dump(config, stream, indent=2)
                stream.write("\\n")
            changed_files += 1
print(f"Configured SedpMaxMessageSize=1400 in {changed_sections} RTPS discovery sections across {changed_files} files")
PY`,
  ];
}

export function multicastGroupDiscoveryCommands(): string[] {
  return [
    'python3 /opt/opendds-config/scripts/discover_aws_multicast_groups.py /opt/opendds-config/config /opt/opendds-config/control_opendds_config.ini > /tmp/aws-multicast-groups.txt',
    '[[ -s /tmp/aws-multicast-groups.txt ]]',
  ];
}

export function staticMulticastRegistrationCommands(multicastDomainId: string): string[] {
  return [
    'imdsv2_token="$(curl -fsS -X PUT -H \'X-aws-ec2-metadata-token-ttl-seconds: 21600\' http://169.254.169.254/latest/api/token)"',
    'metadata_mac="$(curl -fsS -H "X-aws-ec2-metadata-token: $imdsv2_token" http://169.254.169.254/latest/meta-data/network/interfaces/macs/ | head -1)"',
    'network_interface_id="$(curl -fsS -H "X-aws-ec2-metadata-token: $imdsv2_token" "http://169.254.169.254/latest/meta-data/network/interfaces/macs/${metadata_mac}interface-id")"',
    '[[ "$network_interface_id" == eni-* ]]',
    `multicast_domain_id='${multicastDomainId}'`,
    'cp /tmp/aws-multicast-groups.txt "$network_evidence_dir/static-registration-groups.txt"',
    'while IFS= read -r multicast_group; do',
    '  aws ec2 register-transit-gateway-multicast-group-members --transit-gateway-multicast-domain-id "$multicast_domain_id" --group-ip-address "$multicast_group" --network-interface-ids "$network_interface_id"',
    '  registered=0',
    '  for attempt in {1..120}; do',
    '    registered="$(aws ec2 search-transit-gateway-multicast-groups --transit-gateway-multicast-domain-id "$multicast_domain_id" --filters "Name=group-ip-address,Values=$multicast_group" "Name=network-interface-id,Values=$network_interface_id" --query \'length(MulticastGroups[?GroupMember==`true`])\' --output text)"',
    '    [[ "$registered" -ge 1 ]] && break',
    '    sleep 0.5',
    '  done',
    '  [[ "$registered" -ge 1 ]]',
    'done < /tmp/aws-multicast-groups.txt',
    'printf \'%s\\n\' "$network_interface_id" > "$network_evidence_dir/static-registration-eni.txt"',
  ];
}

export class RunStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RunStackProps) {
    super(scope, id, props);
    const stage = this.node.tryGetContext('stage') ?? 'dev';
    const prefix = `/opendds-performance/${stage}`;
    const parameter = (name: string) => ssm.StringParameter.valueForStringParameter(this, `${prefix}/${name}`);
    const artifactBucket = s3.Bucket.fromBucketName(this, 'Artifacts', parameter('artifactBucket'));
    const table = dynamodb.Table.fromTableName(this, 'Runs', parameter('runTable'));
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: parameter('vpcId'),
      availabilityZones: [props.config.availabilityZone],
      privateSubnetIds: [parameter('subnetId')],
      privateSubnetRouteTableIds: [parameter('routeTableId')],
    });
    const subnet = ec2.Subnet.fromSubnetAttributes(this, 'Subnet', {
      subnetId: parameter('subnetId'),
      availabilityZone: props.config.availabilityZone,
      routeTableId: parameter('routeTableId'),
    });
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroup', parameter('securityGroupId'));
    const ec2ApiEndpoint = !props.config.dynamicMulticastRegistration
      ? new ec2.CfnVPCEndpoint(this, 'Ec2ApiEndpoint', {
        vpcId: vpc.vpcId,
        serviceName: `com.amazonaws.${this.region}.ec2`,
        vpcEndpointType: 'Interface',
        subnetIds: [subnet.subnetId],
        securityGroupIds: [securityGroup.securityGroupId],
        privateDnsEnabled: true,
      })
      : undefined;

    const role = new iam.Role(this, 'InstanceRole', {assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')});
    artifactBucket.grantReadWrite(role, `staging/${props.config.runId}/*`);
    artifactBucket.grantReadWrite(role, `logs/${props.config.runId}/*`);
    artifactBucket.grantRead(role, props.config.artifactKey);
    artifactBucket.grantRead(role, props.config.configKey);
    table.grantReadWriteData(role);
    if (!props.config.dynamicMulticastRegistration) {
      role.addToPolicy(new iam.PolicyStatement({
        actions: [
          'ec2:RegisterTransitGatewayMulticastGroupMembers',
          'ec2:SearchTransitGatewayMulticastGroups',
        ],
        resources: ['*'],
      }));
    }
    const profile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {roles: [role.roleName]});

    const placementGroup = new ec2.CfnPlacementGroup(this, 'PlacementGroup', {strategy: 'cluster'});
    const transitGateway = new ec2.CfnTransitGateway(this, 'TransitGateway', {
      multicastSupport: 'enable',
      defaultRouteTableAssociation: 'disable',
      defaultRouteTablePropagation: 'disable',
      tags: runTags(props.config),
    });
    const attachment = new ec2.CfnTransitGatewayVpcAttachment(this, 'VpcAttachment', {
      transitGatewayId: transitGateway.ref,
      vpcId: vpc.vpcId,
      subnetIds: [subnet.subnetId],
      tags: runTags(props.config),
    });
    const multicastDomain = new ec2.CfnTransitGatewayMulticastDomain(this, 'MulticastDomain', {
      transitGatewayId: transitGateway.ref,
      options: {Igmpv2Support: 'enable', StaticSourcesSupport: 'disable', AutoAcceptSharedAssociations: 'disable'},
      tags: runTags(props.config),
    });
    multicastDomain.addDependency(transitGateway);
    const association = new ec2.CfnTransitGatewayMulticastDomainAssociation(this, 'MulticastAssociation', {
      subnetId: subnet.subnetId,
      transitGatewayAttachmentId: attachment.ref,
      transitGatewayMulticastDomainId: multicastDomain.ref,
    });

    const machineImage = ec2.MachineImage.genericLinux({[this.region]: props.config.amiId});
    const ebsKey = kms.Alias.fromAliasName(this, 'EbsKey', 'alias/aws/ebs');
    const fileSystem = new efs.CfnFileSystem(this, 'SharedBenchConfig', {
      encrypted: true,
      throughputMode: 'bursting',
      fileSystemTags: runTags(props.config),
    });
    const mountTarget = new efs.CfnMountTarget(this, 'SharedBenchConfigMount', {
      fileSystemId: fileSystem.ref,
      subnetId: subnet.subnetId,
      securityGroups: [securityGroup.securityGroupId],
    });
    const commonUserData = ec2.UserData.forLinux();
    commonUserData.addCommands(
      'set -euxo pipefail',
      ...clockSyncCommands(),
      ...udpBufferTuningCommands(),
      'sysctl -w net.ipv4.conf.all.force_igmp_version=2',
      'sysctl -w net.ipv4.conf.default.force_igmp_version=2',
      'mkdir -p /opt/opendds-bench /opt/opendds-config',
      `for attempt in {1..30}; do mount -t nfs4 -o nfsvers=4.1 ${fileSystem.ref}.efs.${this.region}.amazonaws.com:/ /opt/opendds-config && break; sleep 2; done`,
      'mountpoint -q /opt/opendds-config',
      ...(props.config.suite === 'relay-diagnostic'
        ? [
          'core_dir="/opt/opendds-config/core-diagnostics/$HOSTNAME"',
          'mkdir -p "$core_dir"',
          'chmod 1777 "$core_dir"',
          'sysctl -w "kernel.core_pattern=$core_dir/core.%e.%p.%t"',
          'ulimit -c unlimited',
          'printf "core_pattern=%s\\ncore_limit=%s\\n" "$(cat /proc/sys/kernel/core_pattern)" "$(ulimit -c)" > "$core_dir/settings.txt"',
        ]
        : []),
      'mkdir -p "/opt/opendds-config/clock-diagnostics/$HOSTNAME"',
      'cp -a "$clock_evidence_dir/." "/opt/opendds-config/clock-diagnostics/$HOSTNAME/"',
      'clock_monitor_log="/opt/opendds-config/clock-diagnostics/$HOSTNAME/monitor.log"',
      `nohup bash -c 'while true; do date -u +%FT%TZ; chronyc tracking; chronyc sources -n; sleep 30; done' > "$clock_monitor_log" 2>&1 &`,
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.artifactKey} /tmp/bench.tar.gz`,
      `aws s3 cp s3://${artifactBucket.bucketName}/${props.config.configKey} /tmp/config.tar.gz`,
      'tar -xzf /tmp/bench.tar.gz -C /opt/opendds-bench --strip-components=1',
      `flock /opt/opendds-config/.bootstrap.lock -c 'if [ ! -f /opt/opendds-config/.ready-${props.config.configCommit} ]; then tar -xzf /tmp/config.tar.gz -C /opt/opendds-config && touch /opt/opendds-config/.ready-${props.config.configCommit}; fi'`,
      // AWS Transit Gateway drops fragmented multicast IP packets. Keep RTPS
      // messages below the path MTU so OpenDDS fragments large control samples
      // at the RTPS layer instead of relying on IP fragmentation.
      `flock /opt/opendds-config/.control.lock -c "grep -q '^max_message_size=1400$' /opt/opendds-config/control_opendds_config.ini || printf '\nmax_message_size=1400\nheartbeat_period=100\nnak_response_delay=20\nResponsiveMode=1\nsend_buffer_size=4194304\nrcv_buffer_size=4194304\n' >> /opt/opendds-config/control_opendds_config.ini"`,
      // node_controller's default worker command uses $BENCH_ROOT/worker/worker,
      // while install_bench.pl installs the executable as $BENCH_ROOT/bin/worker.
      // Preserve each worker's inputs and outputs before node_controller removes
      // its per-worker temporary directory. This distinguishes data-plane test
      // failures from failures returning reports over the control domain.
      'mkdir -p /opt/opendds-bench/worker',
      `cat > /opt/opendds-bench/worker/worker <<'WORKER_WRAPPER'
#!/usr/bin/env bash
diagnostic_dir="/opt/opendds-config/worker-diagnostics/${'$'}{HOSTNAME}-${'$'}${'$'}"
mkdir -p "${'$'}diagnostic_dir"
transcript="${'$'}diagnostic_dir/wrapper.log"
config_path="${'$'}{1:-}"
report_path=""
log_path=""
previous=""
for argument in "${'$'}@"; do
  case "${'$'}previous" in
    --report) report_path="${'$'}argument" ;;
    --log) log_path="${'$'}argument" ;;
  esac
  previous="${'$'}argument"
done
printf '%s worker args:' "${'$'}(date -u +%FT%TZ)" >> "${'$'}transcript"
printf ' %q' "${'$'}@" >> "${'$'}transcript"
printf '\n' >> "${'$'}transcript"
# Keep the large discovery scenario at its normal logging level, but capture
# detailed SPDP/SEDP progress for the two-worker RTPS echo scenario.
python3 - "${'$'}config_path" >> "${'$'}transcript" 2>&1 <<'PY'
import json
import sys

path = sys.argv[1]
with open(path) as stream:
    config = json.load(stream)
sections = config.get("process", {}).get("config_sections", [])
is_echo_rtps = any(
    prop.get("name") == "DCPSDefaultDiscovery" and prop.get("value") == "rtps_disc"
    for section in sections for prop in section.get("properties", [])
)
if is_echo_rtps:
    common = next(section for section in sections if section.get("name") == "common")
    properties = common.setdefault("properties", [])
    debug = next((prop for prop in properties if prop.get("name") == "DCPSDebugLevel"), None)
    if debug:
        debug["value"] = "6"
    else:
        properties.append({"name": "DCPSDebugLevel", "value": "6"})
    properties.append({"name": "DCPSTransportDebugLevel", "value": "2"})
    with open(path, "w") as stream:
        json.dump(config, stream, indent=2)
    print("Enabled focused RTPS discovery diagnostics")
PY
cp "${'$'}config_path" "${'$'}diagnostic_dir/config.json" 2>> "${'$'}transcript" || true
# node_controller collects statistics for the PID it spawns.  Preserve that PID
# by replacing this wrapper with the real worker instead of waiting for it as a
# child.  Symlink the worker outputs into the shared diagnostic directory so
# node_controller can remove its temporary names without removing our copies.
if [ -n "${'$'}log_path" ]; then
  touch "${'$'}diagnostic_dir/worker.log"
  ln -sf "${'$'}diagnostic_dir/worker.log" "${'$'}log_path"
fi
if [ -n "${'$'}report_path" ]; then
  touch "${'$'}diagnostic_dir/report.json"
  ln -sf "${'$'}diagnostic_dir/report.json" "${'$'}report_path"
fi
exec /opt/opendds-bench/bin/worker "${'$'}@"
WORKER_WRAPPER`,
      'chmod 755 /opt/opendds-bench/worker/worker',
      'cp /opt/opendds-config/control_opendds_config.ini /opt/opendds-bench/control_opendds_config.ini',
      'export BENCH_ROOT=/opt/opendds-bench',
      'export PATH=$BENCH_ROOT/bin:$PATH',
      'export LD_LIBRARY_PATH=$BENCH_ROOT/lib',
      'export BENCH_CONFIG_DIR=/opt/opendds-config',
      ...multicastReceiverCommands(),
      ...awsDiscoveryConfigCommands(),
      ...multicastGroupDiscoveryCommands(),
      ...(!props.config.dynamicMulticastRegistration
        ? staticMulticastRegistrationCommands(multicastDomain.ref)
        : []),
    );

    const legUserData = ec2.UserData.custom(commonUserData.render());
    legUserData.addCommands(
      'mkdir -p /opt/opendds-config/node-controller-logs',
      'node_controller_log="/opt/opendds-config/node-controller-logs/${HOSTNAME}.log"',
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-leg-${props.config.stackRunId}-$RANDOM -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > "$node_controller_log" 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      'kill -0 "$node_controller_pid" || { cat "$node_controller_log"; exit 1; }',
    );
    const legLaunchTemplate = new ec2.LaunchTemplate(this, 'LegLaunchTemplate', {
      machineImage,
      instanceType: new ec2.InstanceType(props.config.instanceType),
      role,
      securityGroup,
      userData: legUserData,
      requireImdsv2: true,
      detailedMonitoring: false,
      blockDevices: [{deviceName: '/dev/xvda', volume: ec2.BlockDeviceVolume.ebs(16, {encrypted: true, kmsKey: ebsKey, volumeType: ec2.EbsDeviceVolumeType.GP3})}],
    });
    const cfnLaunchTemplate = legLaunchTemplate.node.defaultChild as ec2.CfnLaunchTemplate;
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.Placement.GroupName', placementGroup.ref);
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.CpuOptions.CoreCount', props.config.topology.coresPerLeg);
    cfnLaunchTemplate.addPropertyOverride('LaunchTemplateData.CpuOptions.ThreadsPerCore', 1);
    const legs = new autoscaling.AutoScalingGroup(this, 'Legs', {
      vpc,
      vpcSubnets: {subnets: [subnet]},
      launchTemplate: legLaunchTemplate,
      minCapacity: props.config.topology.legCount,
      maxCapacity: props.config.topology.legCount,
      healthChecks: autoscaling.HealthChecks.ec2({gracePeriod: cdk.Duration.minutes(10)}),
    });
    cdk.Tags.of(legs).add('OpenDdsPerformanceRun', props.config.runId);

    const controllerUserData = ec2.UserData.custom(commonUserData.render());
    controllerUserData.addCommands(
      `export RUN_ID='${props.config.runId}' SUITE='${props.config.suite}' OPENDDS_COMMIT='${props.config.commitSha}' CONFIG_COMMIT='${props.config.configCommit}' MULTICAST_REGISTRATION_MODE='${props.config.dynamicMulticastRegistration ? 'dynamic' : 'static'}'`,
      `export ARTIFACT_BUCKET='${artifactBucket.bucketName}' RUN_TABLE='${table.tableName}' EXPECTED_LEGS='${props.config.topology.legCount}'`,
      'mkdir -p /opt/opendds-config/node-controller-logs',
      'node_controller_log="/opt/opendds-config/node-controller-logs/${HOSTNAME}.log"',
      `nohup /opt/opendds-bench/bin/node_controller daemon --name aws-controller-${props.config.stackRunId} -DCPSConfigFile /opt/opendds-config/control_opendds_config.ini > "$node_controller_log" 2>&1 &`,
      'node_controller_pid=$!',
      'sleep 5',
      `kill -0 "$node_controller_pid" || { cat "$node_controller_log"; aws dynamodb update-item --table-name "$RUN_TABLE" --key '{"pk":{"S":"RUN"},"sk":{"S":"${props.config.runId}"}}' --update-expression 'SET #status = :status, errors = :errors' --expression-attribute-names '{"#status":"status"}' --expression-attribute-values '{":status":{"S":"FAILED"},":errors":{"N":"1"}}'; exit 1; }`,
      ...multicastSenderCommands(),
      'sleep 85',
      'python3 /tmp/configure-aws-discovery.py /opt/opendds-config/config',
      'set +e',
      '/opt/opendds-config/scripts/run_aws_suite.sh',
      'suite_exit=$?',
      ...networkScenarioSummaryCommands(),
      `aws s3 cp /opt/opendds-config/node-controller-logs "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/node-controller-logs" --recursive`,
      `aws s3 cp /opt/opendds-config/clock-diagnostics "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/clock-diagnostics" --recursive`,
      `aws s3 cp /opt/opendds-config/worker-diagnostics "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/worker-diagnostics" --recursive`,
      `aws s3 cp /opt/opendds-config/network-diagnostics "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/network-diagnostics" --recursive`,
      ...(props.config.suite === 'relay-diagnostic'
        ? [`aws s3 cp /opt/opendds-config/core-diagnostics "s3://${artifactBucket.bucketName}/logs/${props.config.runId}/core-diagnostics" --recursive`]
        : []),
      `if [ "$suite_exit" -ne 0 ]; then aws dynamodb update-item --table-name "$RUN_TABLE" --key '{"pk":{"S":"RUN"},"sk":{"S":"${props.config.runId}"}}' --update-expression 'SET #status = :status, errors = :errors' --expression-attribute-names '{"#status":"status"}' --expression-attribute-values '{":status":{"S":"FAILED"},":errors":{"N":"1"}}'; fi`,
      'exit "$suite_exit"',
    );
    const controller = new ec2.CfnInstance(this, 'Controller', {
      imageId: props.config.amiId,
      instanceType: props.config.instanceType,
      subnetId: subnet.subnetId,
      securityGroupIds: [securityGroup.securityGroupId],
      iamInstanceProfile: profile.ref,
      userData: cdk.Fn.base64(controllerUserData.render()),
      metadataOptions: {httpTokens: 'required', httpEndpoint: 'enabled'},
      placementGroupName: placementGroup.ref,
      cpuOptions: {coreCount: props.config.topology.coresPerLeg, threadsPerCore: 1},
      blockDeviceMappings: [{deviceName: '/dev/xvda', ebs: {volumeSize: 16, volumeType: 'gp3', encrypted: true, kmsKeyId: ebsKey.keyArn, deleteOnTermination: true}}],
      tags: [...runTags(props.config), {key: 'Name', value: `opendds-controller-${props.config.stackRunId}`}],
    });
    controller.addDependency(association);
    controller.addDependency(mountTarget);
    controller.addDependency(profile);
    if (ec2ApiEndpoint) controller.node.addDependency(ec2ApiEndpoint);
    (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(association);
    (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(mountTarget);
    if (ec2ApiEndpoint) {
      (legs.node.defaultChild as autoscaling.CfnAutoScalingGroup).addDependency(ec2ApiEndpoint);
    }

    new cdk.CfnOutput(this, 'RunId', {value: props.config.runId});
    new cdk.CfnOutput(this, 'ControllerInstanceId', {value: controller.ref});
  }
}

function runTags(config: RunConfig): cdk.CfnTag[] {
  return [
    {key: 'OpenDdsPerformanceRun', value: config.runId},
    {key: 'OpenDdsCommit', value: config.commitSha},
    {key: 'ExpiresAfterMinutes', value: String(config.maxRunMinutes)},
  ];
}
