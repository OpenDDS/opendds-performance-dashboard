#!/usr/bin/env python3

import json
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
                            separators=(",", ":")) + "\n")
    for profile, count, interval in profiles:
        for sequence in range(count):
            sent_ns = time.time_ns()
            message = json.dumps({"profile": profile, "sequence": sequence,
                                  "sent_ns": sent_ns}, separators=(",", ":")).encode()
            payload = message + b" " * (1400 - len(message))
            sock.sendto(payload, (group, port))
            stream.write(json.dumps({"profile": profile, "sequence": sequence,
                                     "sent_ns": sent_ns, "payload_size": len(payload)},
                                    separators=(",", ":")) + "\n")
            target = sent_ns + int(interval * 1_000_000_000)
            while time.time_ns() < target:
                time.sleep(min(interval / 4, 0.001))
        time.sleep(2)
