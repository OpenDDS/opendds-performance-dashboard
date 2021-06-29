const fs = require('fs');
const fetch = require('node-fetch');

const MOCKING_PATH = 'public/mocking';
const RUN_INDEX_FILE = `${MOCKING_PATH}/run_index.json`;
const STATS_FILE = `${MOCKING_PATH}/stat_properties.json`;

const RUN_INDEX_URL = 'http://scoreboard.ociweb.com/bench2/run_index.json';
const SCRAPE_URL = 'http://scoreboard.ociweb.com/bench2/scrape_output.json';

async function loadRemoteData() {
  const response = await fetch(SCRAPE_URL);
  return response.json();
}

async function loadRunIndex() {
  return await fetch(RUN_INDEX_URL);
}

async function generateEntries(fullData = {}) {
  Object.entries(fullData).forEach(([key, entry]) => {
    const newPath = `${MOCKING_PATH}/raw/${key}`;
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }
    fs.writeFileSync(`${newPath}/results.json`, JSON.stringify(entry, null, 2));
  });
}

async function scrape() {
  const start = Date.now();

  const runIndex = await loadRunIndex();
  fs.writeFileSync(RUN_INDEX_FILE, JSON.stringify(runIndex, null, 2));

  const data = await loadRemoteData();
  fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));

  generateEntries(data);
  const end = Date.now();

  console.log(`Took ${(start - end) / 1000} Seconds`);
}

scrape();
