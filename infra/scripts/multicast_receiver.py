#!/usr/bin/env python3

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
                             "monotonic_ns": time.monotonic_ns(), "group": group, "port": port}) + "\n")
    while True:
        payload, address = sock.recvfrom(65535)
        received_ns = time.time_ns()
        try:
            message = json.loads(payload.rstrip(b" ").decode())
        except Exception as error:
            message = {"decode_error": str(error), "payload_size": len(payload)}
        message.update({"event": "received", "receiver": host, "source": address[0],
                        "received_ns": received_ns, "payload_size": len(payload)})
        stream.write(json.dumps(message, separators=(",", ":")) + "\n")
