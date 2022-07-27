import {default as fetch} from 'node-fetch';
import {default as fs} from 'fs';

const BASE_URL = 'http://scoreboard.ociweb.com/bench2/';
const MDTD = 'Max Discovery Time Delta';
const SCENARIO_NAME_PREFIXES = [
  'disco',
  'echo_rtps',
  'echo_tcp',
  'fan_rtps',
  'fan_tcp',
  'showtime_mixed'
];
const STAT_NAMES = ['count', 'min', 'max', 'mean', 'stdev', 'median', 'madev'];
const STAT_TYPES = [
  'Latency',
  'Jitter',
  'Round Trip Latency',
  'Round Trip Jitter'
];

async function getAllData() {
  const data = {};

  try {
    const commits = await getCommits();
    for (const commit of commits) {
      const commitObj = (data[commit] = {});

      const scenarioNames = await getScenarioNames(commit);
      for (const scenarioName of scenarioNames) {
        const name = SCENARIO_NAME_PREFIXES.find(prefix =>
          scenarioName.startsWith(prefix + '_')
        );

        if (name) {
          const suffix = scenarioName.substring(name.length + 1);

          let scenarioObj = commitObj[name];
          if (!scenarioObj) scenarioObj = commitObj[name] = {};
          scenarioObj[suffix] = await getScenarioData(commit, scenarioName);
        }
      }
    }

    fs.writeFileSync(
      'public/open-dds-statistics.json',
      JSON.stringify(data, null, 2)
    );
  } catch (e) {
    console.error(e);
  }
}

async function getCommits() {
  const A_START = '<A HREF="./';
  const A_END = '/">';

  try {
    const res = await fetch(BASE_URL);
    const html = await res.text();
    const lines = html.split('\n');
    const anchorLines = lines.filter(line => line.includes('folder.gif'));
    const commits = anchorLines.map(line => {
      const start = line.indexOf(A_START);
      const end = line.indexOf(A_END, start);
      return line.substring(start + A_START.length, end);
    });
    return commits;
  } catch (e) {
    console.error(e);
  }
}

// The name parameter can be one of the strings in SCENARIO_NAME_PREFIXES.
async function getData(dsName, statType) {
  const data = {};

  try {
    const commits = await getCommits();
    for (const commit of commits) {
      const allScenarioNames = await getScenarioNames(commit);
      const matchingScenarioNames = allScenarioNames.filter(scenarioName =>
        scenarioName.startsWith(dsName + '_')
      );
      if (matchingScenarioNames.length) {
        const commitObj = (data[commit] = {});
        for (const scenarioName of matchingScenarioNames) {
          const suffix = scenarioName.substring(dsName.length + 1);

          let scenarioObj = commitObj[dsName];
          if (!scenarioObj) scenarioObj = commitObj[dsName] = {};
          const stats = await getScenarioStats(commit, scenarioName, statType);
          if (stats) scenarioObj[suffix] = stats;
        }
      }
    }
    return data;
  } catch (e) {
    console.error(e);
  }
}

function getMaxDiscoveryTimeDelta(lines) {
  // Find line that begins with "Discovery".
  let i = 0;
  while (i < lines.length) {
    const line = lines[++i];
    if (line.startsWith('Discovery')) break;
  }

  if (i === lines.length) return 0;

  // Get value from line that is two lines after that one.
  const line = lines[i + 2];
  const startIndex = line.indexOf(':') + 2;
  const endIndex = line.indexOf(' ', startIndex);
  return Number(line.substring(startIndex, endIndex));
}

async function getScenarioData(commit, scenarioName) {
  const data = {};

  try {
    const res = await fetch(BASE_URL + commit + '/' + scenarioName);
    const html = await res.text();
    const lines = html.split('\n');
    if (scenarioName.startsWith('disco_')) {
      data[MDTD] = getMaxDiscoveryTimeDelta(lines);
    } else {
      for (const statType of STAT_TYPES) {
        data[statType] = getStats(lines, statType);
      }
    }
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getScenarioNames(commit) {
  const A_START = '<A HREF="';
  const A_END = '">';

  try {
    const res = await fetch(BASE_URL + commit);
    const html = await res.text();
    const lines = html.split('\n');
    const anchorLines = lines.filter(line =>
      line.includes('/icons/unknown.gif')
    );
    const scenarioNames = anchorLines.map(line => {
      const start = line.indexOf(A_START);
      const end = line.indexOf(A_END, start);
      return line.substring(start + A_START.length, end);
    });
    return scenarioNames;
  } catch (e) {
    console.error(e);
  }
}

async function getScenarioStats(commit, scenarioName, statType) {
  try {
    const res = await fetch(BASE_URL + commit + '/' + scenarioName);
    const html = await res.text();
    const lines = html.split('\n');
    return getStats(lines, statType);
  } catch (e) {
    console.error(e);
  }
}

function getStat(statName, lines, startIndex) {
  let i = startIndex;
  while (i < lines.length) {
    const line = lines[++i];
    if (!line.startsWith('  ')) break;

    const [key, value] = line.split(' = ');
    if (key.endsWith(statName)) return Number(value);
  }

  return 0;
}

function getStats(lines, type) {
  const stats = {};

  // Find the start of the given statistics type.
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith(type)) break;
    i++;
  }

  if (i < lines.length) {
    // not at end of file
    for (const statName of STAT_NAMES) {
      stats[statName] = getStat(statName, lines, i);
    }
  }

  return stats;
}

export {getData};
