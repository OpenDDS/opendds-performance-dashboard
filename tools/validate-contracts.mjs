#!/usr/bin/env node
import {readFile} from 'node:fs/promises';

const [indexPath, ...resultPaths] = process.argv.slice(2);
if (!indexPath) {
  console.error('Usage: node tools/validate-contracts.mjs RUN_INDEX [RESULT ...]');
  process.exit(2);
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
if (!Array.isArray(index)) throw new Error('run index must be an array');
const keys = new Set();
for (const run of index) {
  for (const key of ['key', 'date', 'commit', 'errors']) {
    if (!(key in run)) throw new Error(`run index entry is missing ${key}`);
  }
  if (keys.has(run.key)) throw new Error(`duplicate run key: ${run.key}`);
  keys.add(run.key);
  if (run.topology && run.topology.legCount > 99) throw new Error(`multicast topology exceeds 99 legs: ${run.key}`);
}

for (const path of resultPaths) {
  const result = JSON.parse(await readFile(path, 'utf8'));
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error(`${path} must contain a JSON object`);
  }
  for (const [scenario, sizes] of Object.entries(result)) {
    if (scenario === 'run_parameters') continue;
    if (!sizes || typeof sizes !== 'object' || Array.isArray(sizes)) {
      throw new Error(`${path}: scenario ${scenario} must contain an object`);
    }
  }
}

console.log(`Validated ${index.length} index entries and ${resultPaths.length} result files`);
