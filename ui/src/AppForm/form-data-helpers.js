import {BY_SIZE, BY_TIMESTAMP} from '../AppCharting/chart-data-extractor';
export const MDTD = 'Max Discovery Time Delta';
export const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];
export const DEFAULT_CHART_TYPE = BY_SIZE;
export const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
export const DEFAULT_RECENT_COUNT = 5;
export const DEFAULT_SCENARIO = 'fan_rtps';
export const DEFAULT_STAT_NAME = 'mean';
export const DEFAULT_SERVER_COUNT = 16;

export function deriveSelectOptionsFromData(benchmarks) {
  const uniqueScenarios = new Set();
  const uniquePlotTypes = new Set();
  const uniqueStatNames = new Set();
  const uniqueServerCounts = new Map();

  const benchmarkEntries = Object.values(benchmarks);

  function updateServerCount(scenario, count) {
    if (!uniqueServerCounts.has(scenario)) {
      uniqueServerCounts.set(scenario, new Set());
    }
    if (count) {
      uniqueServerCounts.get(scenario).add(parseInt(count));
    }
  }

  benchmarkEntries.forEach(timestampObj => {
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
