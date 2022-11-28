import {BY_SIZE, BY_TIMESTAMP} from '../AppCharting/chart-data-extractor';
import type {
  Benchmarks,
  FormSelectOptions,
  PlotType,
  Scenario,
  IgnoredStatistics,
  StatName,
  FormScenarioOptions
} from '../types';
import {configParamMap} from '../utility/param-map';

export const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];
export const DEFAULT_CHART_TYPE = BY_SIZE;
export const DEFAULT_PLOT_TYPE = 'Discovery Time Delta';
export const DEFAULT_RECENT_COUNT = 5;
export const DEFAULT_SCENARIO = 'disco-rtps';
export const DEFAULT_SERVER_COUNT = 16;
export const DEFAULT_STAT_NAME = 'median';
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
    if (!timestampObj['run_parameters']) {
      return;
    }
    for (const [, sData] of Object.entries(timestampObj).filter(
      ([key]) => key != 'run_parameters'
    )) {
      const sParams = sData['scenario_parameters'];
      if (sParams) {
        const sBase = sParams['Base'];
        const sConfig = sParams['Config'];
        const sName = sConfig
          ? sBase + '-' + (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
          : sBase;
        uniqueScenarios.add(<Scenario>sName);

        for (const [sparam, sparamEntry] of Object.entries(sParams)) {
          if (sparam === 'Servers') {
            updateServerCount(<Scenario>sName, <number>(<unknown>sparamEntry));
          }
        }

        for (const [plotType, plotTypeObj] of Object.entries(sData).filter(
          ([key]) => key != 'scenario_parameters'
        )) {
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
    scenarios: [...uniqueScenarios].sort().reduce((acc, scenario) => {
      const serverCounts: number[] = serverCountMap[scenario] || [];
      acc[scenario] = {serverCounts};
      return acc;
    }, {} as Record<Scenario, FormScenarioOptions>),
    plotTypes: allPlotTypes,
    statNames: [...uniqueStatNames].sort()
  };
}
