#!/usr/bin/env python3

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
        stream.write(json.dumps(counters, separators=(",", ":")) + "\n")
        time.sleep(5)
