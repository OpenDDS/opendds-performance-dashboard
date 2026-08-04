#!/usr/bin/env python3

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
                stream.write("\n")
            changed_files += 1
print(f"Configured SedpMaxMessageSize=1400 in {changed_sections} RTPS discovery sections across {changed_files} files")
