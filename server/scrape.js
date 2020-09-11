const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://scoreboard.ociweb.com/bench2/';
const DATA_SET_NAME_PREFIXES = [
  'disco',
  'echo_rtps',
  'echo_tcp',
  'fan_rtps',
  'fan_tcp',
  'showtime_mixed'
];
const MDTD = 'Max Discovery Time Delta';
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

      const dataSetNames = await getDataSetNames(commit);
      for (const dataSetName of dataSetNames) {
        const name = DATA_SET_NAME_PREFIXES.find(prefix =>
          dataSetName.startsWith(prefix + '_')
        );

        if (name) {
          const suffix = dataSetName.substring(name.length + 1);

          let dataSetObj = commitObj[name];
          if (!dataSetObj) dataSetObj = commitObj[name] = {};
          dataSetObj[suffix] = await getDataSetData(commit, dataSetName);
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

// The name parameter can be one of the strings in DATA_SET_NAME_PREFIXES.
async function getData(dsName, statType) {
  const data = {};

  try {
    const commits = await getCommits();
    for (const commit of commits) {
      const allDataSetNames = await getDataSetNames(commit);
      const matchingDataSetNames = allDataSetNames.filter(dataSetName =>
        dataSetName.startsWith(dsName + '_')
      );
      if (matchingDataSetNames.length) {
        const commitObj = (data[commit] = {});
        for (const dataSetName of matchingDataSetNames) {
          const suffix = dataSetName.substring(dsName.length + 1);

          let dataSetObj = commitObj[dsName];
          if (!dataSetObj) dataSetObj = commitObj[dsName] = {};
          const stats = await getDataSetStats(commit, dataSetName, statType);
          if (stats) dataSetObj[suffix] = stats;
        }
      }
    }
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getDataSetData(commit, dataSetName) {
  const data = {};

  try {
    const res = await fetch(BASE_URL + commit + '/' + dataSetName);
    const html = await res.text();
    const lines = html.split('\n');
    if (dataSetName.startsWith('disco_')) {
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

async function getDataSetNames(commit) {
  const A_START = '<A HREF="';
  const A_END = '">';

  try {
    const res = await fetch(BASE_URL + commit);
    const html = await res.text();
    const lines = html.split('\n');
    const anchorLines = lines.filter(line =>
      line.includes('/icons/unknown.gif')
    );
    const dataSetNames = anchorLines.map(line => {
      const start = line.indexOf(A_START);
      const end = line.indexOf(A_END, start);
      return line.substring(start + A_START.length, end);
    });
    return dataSetNames;
  } catch (e) {
    console.error(e);
  }
}

async function getDataSetStats(commit, dataSetName, statType) {
  try {
    const res = await fetch(BASE_URL + commit + '/' + dataSetName);
    const html = await res.text();
    const lines = html.split('\n');
    return getStats(lines, statType);
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

if (!module.parent) getAllData();

module.exports = {getData};
