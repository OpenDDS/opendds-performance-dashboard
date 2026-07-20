#!/usr/bin/env node
import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  console.error('Usage: node tools/import-centipede.mjs SOURCE_BENCH2 OUTPUT_BENCH2');
  process.exit(2);
}

const sourceIndex = JSON.parse(await readFile(path.join(source, 'run_index.json'), 'utf8'));
const imported = [];
await mkdir(path.join(destination, 'raw'), {recursive: true});
for (const run of sourceIndex) {
  const sourceResult = path.join(source, 'raw', run.key, 'results.json');
  JSON.parse(await readFile(sourceResult, 'utf8'));
  const target = path.join(destination, 'raw', run.key);
  await mkdir(target, {recursive: true});
  await cp(sourceResult, path.join(target, 'results.json'));
  imported.push({...run, era: 'centipede', status: run.status ?? 'SUCCEEDED'});
}
imported.sort((a, b) => a.date.localeCompare(b.date));
await writeFile(path.join(destination, 'run_index.json'), `${JSON.stringify(imported, null, 2)}\n`);
console.log(`Imported ${imported.length} centipede runs`);
