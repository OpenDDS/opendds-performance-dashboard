export const MISSING_VALUE = -0.0000001;
export const BY_SIZE = 'by size';
export const BY_TIMESTAMP = 'by timestamp';
export const MDTD = 'Max Discovery Time Delta';

export function deriveClassNameFromTimestampKey(key) {
  const [date] = key.split('_');
  return date.split('+')[0].replaceAll(' ', '_').replaceAll(':', '-');
}

export function classNameToDateTime(text) {
  const [date, time] = text.split('_');
  const newTime = time.replaceAll('-', ':');
  return date + ' ' + newTime;
}

export function chartDataFactory(type) {
  const fn =
    type === BY_TIMESTAMP ? getChartDataByTimestamp : getChartDataBySize;
  return async (...args) => {
    const data = await fn(...args);
    return applyNames(data);
  };
}

export function applyNames(data) {
  data.names = {};
  for (const column of data.columns) {
    const name = column[0];
    if (name.includes('_')) data.names[name] = classNameToDateTime(name);
  }
  return data;
}

export async function getChartDataBySize(collectedData, opts) {
  const {
    selectedTimestamps,
    scenario,
    serverCount,
    plotType,
    statName,
    isFan
  } = opts;
  let data = {columns: [], x: 'x'};
  if (!scenario || !statName || !plotType) return data;

  const sizes = getSizes(collectedData, scenario, isFan, serverCount);
  const arr = ['x', ...sizes];
  const columns = [arr];

  for (const timestamp of selectedTimestamps) {
    const column = [deriveClassNameFromTimestampKey(timestamp.key)];
    for (const size of sizes) {
      let value = MISSING_VALUE;
      const key = isFan ? size + '_' + serverCount : size;
      const dataPoint = collectedData[timestamp.key];
      let obj = dataPoint && dataPoint[scenario];
      if (obj) {
        obj = obj[key];
        if (obj) {
          const stats = obj[plotType];
          if (stats) value = stats[statName];
        }
      }

      column.push(value);
    }
    columns.push(column);
  }

  return {...data, columns};
}

export async function getChartDataByTimestamp(collectedData, opts) {
  const {
    selectedTimestamps,
    scenario,
    serverCount,
    plotType,
    statName,
    isFan
  } = opts;
  let data = {columns: [], x: 'x'};
  if (!scenario || !statName || !plotType) return data;

  // Load Data For Selected TimeStamps

  const xValues = selectedTimestamps.map(timestamp => timestamp.dateTime);
  const arr = ['x', ...xValues];
  const columns = [arr];

  const dataNames = getDataNames(collectedData, opts);

  for (const dataName of dataNames) {
    const column = [dataName];

    for (const timestamp of selectedTimestamps) {
      let value = 0;
      const dataPoint = collectedData[timestamp.key];
      const dataForName = dataPoint && dataPoint[scenario];
      if (dataPoint) {
        const obj =
          dataForName[isFan ? dataName + '_' + serverCount : dataName];
        if (obj) {
          const stats = obj[plotType];
          if (stats) value = stats[statName];
        }
      }
      column.push(value);
    }

    columns.push(column);
  }

  const xFormat = '%Y-%m-%d %H:%M:%S'; // data format
  return {...data, columns, xFormat};
}

export function getSizes(collectedData, scenario, isFan, serverCount) {
  const sizes = new Set();

  for (const timestampObj of Object.values(collectedData)) {
    const scenarioObj = timestampObj[scenario];
    if (scenarioObj) {
      for (const scenarioSize of Object.keys(scenarioObj)) {
        if (!isFan || scenarioSize.endsWith('_' + serverCount)) {
          sizes.add(isFan ? scenarioSize.split('_')[0] : scenarioSize);
        }
      }
    }
  }

  return [...sizes].sort((n1, n2) => Number(n1) - Number(n2));
}

export function getDataNames(collectedData, {scenario, isFan, serverCount}) {
  const dataNames = new Set();
  for (const timestampObj of Object.values(collectedData)) {
    const scenarioObj = timestampObj[scenario];
    if (scenarioObj) {
      for (const dataName of Object.keys(scenarioObj)) {
        if (!isFan || dataName.endsWith('_' + serverCount)) {
          dataNames.add(isFan ? dataName.split('_')[0] : dataName);
        }
      }
    }
  }
  return [...dataNames].sort((n1, n2) => Number(n1) - Number(n2));
}

export function deriveSelectOptionsFromData(benchmarks) {
  const uniqueScenarios = new Set();
  const uniquePlotTypes = new Set();
  const uniqueStatNames = new Set();
  const uniqueServerCounts = new Map();

  const timestampEntries = Object.values(benchmarks);

  function updateServerCount(scenario, count) {
    if (!uniqueServerCounts.has(scenario)) {
      uniqueServerCounts.set(scenario, new Set());
    }
    if (count) {
      uniqueServerCounts.get(scenario).add(count);
    }
  }

  timestampEntries.forEach(timestampObj => {
    for (const [scenario, scenarioObj] of Object.entries(timestampObj)) {
      uniqueScenarios.add(scenario);

      for (const [scenarioSize, sizeObj] of Object.entries(scenarioObj)) {
        updateServerCount(scenario, scenarioSize.split('_')[1]);

        for (const [plotType, plotTypeObj] of Object.entries(sizeObj)) {
          uniquePlotTypes.add(plotType);

          for (const statName of Object.keys(plotTypeObj)) {
            uniqueStatNames.add(statName);
          }
        }
      }
    }
  });

  uniquePlotTypes.delete('Errors');
  uniquePlotTypes.delete(MDTD);

  const serverCountMap = Object.entries(
    Object.fromEntries(uniqueServerCounts)
  ).reduce((acc, [key, counts]) => {
    acc[key] = [...counts].sort();
    return acc;
  }, {});

  return {
    scenarios: [...uniqueScenarios].sort(),
    allPlotTypes: [...uniquePlotTypes].sort(),
    statNames: [...uniqueStatNames].sort(),
    serverCountMap
  };
}
