#!/usr/bin/env python3

import datetime
import glob
import json
import os
import re
import sys

root = "/opt/opendds-config"
diagnostics = os.path.join(root, "network-diagnostics")
scenarios = []
for path in glob.glob(os.path.join(root, "result", "controller-diagnostics", "*.log")):
    with open(path) as stream:
        text = stream.read()
    started = re.search(r"^Started at (\S+)", text, re.MULTILINE)
    ended = re.search(r"^Ended at (\S+)", text, re.MULTILINE)
    if started and ended:
        to_ns = lambda value: int(datetime.datetime.fromisoformat(
            value.replace("Z", "+00:00")).timestamp() * 1_000_000_000)
        scenarios.append((os.path.basename(path)[:-4], to_ns(started.group(1)),
                          to_ns(ended.group(1))))

interesting = re.compile(
    r"^(Udp(InErrors|RcvbufErrors|SndbufErrors|MemErrors)|"
    r"Ip(InDiscards|OutDiscards|ReasmFails|FragFails)|"
    r"softnet_(dropped|time_squeeze)|interface_.*_(dropped|errors))$")
expected_hosts = int(os.environ.get("EXPECTED_LEGS", "0")) + 1
summary = {"sampling_interval_seconds": 5, "expected_hosts": expected_hosts,
           "scenarios": {}}
coverage_errors = []
for scenario, started_ns, ended_ns in scenarios:
    hosts = {}
    for path in glob.glob(os.path.join(diagnostics, "*", "host-network-counters.jsonl")):
        with open(path) as stream:
            samples = [json.loads(line) for line in stream if line.strip()]
        if not samples:
            continue
        before = next((sample for sample in reversed(samples)
                       if sample["wall_ns"] <= started_ns), samples[0])
        after = next((sample for sample in samples
                      if sample["wall_ns"] >= ended_ns), samples[-1])
        delta = {key: after[key] - before.get(key, 0) for key in after
                 if interesting.match(key) and after[key] - before.get(key, 0)}
        hosts[os.path.basename(os.path.dirname(path))] = {
            "sample_start_ns": before["wall_ns"],
            "sample_end_ns": after["wall_ns"],
            "complete_window": (before["wall_ns"] <= started_ns and
                                after["wall_ns"] >= ended_ns),
            "start_offset_seconds": (before["wall_ns"] - started_ns) / 1_000_000_000,
            "end_offset_seconds": (after["wall_ns"] - ended_ns) / 1_000_000_000,
            "delta": delta,
        }
    complete_hosts = sum(host["complete_window"] for host in hosts.values())
    summary["scenarios"][scenario] = {
        "started_ns": started_ns, "ended_ns": ended_ns, "hosts": hosts,
        "observed_hosts": len(hosts), "complete_hosts": complete_hosts}
    if len(hosts) != expected_hosts or complete_hosts != expected_hosts:
        coverage_errors.append(
            "%s: expected %d complete hosts, observed %d with %d complete" %
            (scenario, expected_hosts, len(hosts), complete_hosts))

with open(os.path.join(diagnostics, "scenario-network-summary.json"), "w") as stream:
    json.dump(summary, stream, indent=2, sort_keys=True)

if coverage_errors:
    print("Incomplete network diagnostic coverage: " + "; ".join(coverage_errors),
          file=sys.stderr)
    sys.exit(1)
