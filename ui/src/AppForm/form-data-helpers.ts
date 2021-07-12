import {BY_SIZE, BY_TIMESTAMP} from '../AppCharting/chart-data-extractor';
import type {
  Benchmarks,
  FormSelectOptions,
  PlotType,
  Scenario,
  IgnoredStatistics,
  StatName
} from '../types';

export const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];
export const DEFAULT_CHART_TYPE = BY_SIZE;
export const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
export const DEFAULT_RECENT_COUNT = 5;
export const DEFAULT_SCENARIO = 'fan_rtps';
export const DEFAULT_SERVER_COUNT = 16;
export const DEFAULT_STAT_NAME = 'mean';
export const MDTD = 'Max Discovery Time Delta';

export function deriveSelectOptionsFromData(
  benchmarks: Benchmarks
): FormSelectOptions {
  const uniqueScenarios = new Set<Scenario>();
  const uniquePlotTypes = new Set<PlotType | IgnoredStatistics>();
  const uniqueStatNames = new Set<StatName>();
  const uniqueServerCounts = new Map<Scenario, Set<number>>();

  const benchmarkEntries = Object.values(benchmarks);

  function updateServerCount(scenario: Scenario, count: number | string) {
    if (!uniqueServerCounts.has(scenario)) {
      uniqueServerCounts.set(scenario, new Set());
    }
    if (count) {
      const counts = uniqueServerCounts.get(scenario);
      if (counts) counts.add(parseInt(count.toString()));
    }
  }

  benchmarkEntries.forEach(timestampObj => {
    for (const [scenario, scenarioObj] of Object.entries(timestampObj)) {
      uniqueScenarios.add(<Scenario>scenario);

      for (const [size, sizeEntry] of Object.entries(scenarioObj)) {
        updateServerCount(<Scenario>scenario, size.split('_')[1]);

        for (const [plotType, plotTypeObj] of Object.entries(sizeEntry)) {
          uniquePlotTypes.add(<PlotType>plotType);

          for (const statName of Object.keys(plotTypeObj)) {
            uniqueStatNames.add(<StatName>statName);
          }
        }
      }
    }
  });

  // Cleanup and remove size records from plot type entries
  uniquePlotTypes.delete('Errors');
  uniquePlotTypes.delete(MDTD);
  const allPlotTypes = <PlotType[]>[...uniquePlotTypes].sort();

  const collector: Record<string, number[]> = {};

  const serverCountMap = Object.entries(
    Object.fromEntries(uniqueServerCounts)
  ).reduce((acc, [key, counts]) => {
    acc[key] = [...counts].sort();
    return acc;
  }, collector);

  return {
    scenarios: [...uniqueScenarios].sort(),
    allPlotTypes,
    statNames: [...uniqueStatNames].sort(),
    serverCountMap: <Record<Scenario, number[]>>serverCountMap
  };
}
