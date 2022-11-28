import type {
  FormConfiguration,
  PlotStatistic,
  PlotType,
  Scenario
} from 'src/types';
import {combinations} from '../utility/combinations';

export const SCENARIOS: Scenario[] = [
  'disco-rtps',
  'disco-relay',
  'disco-repo',
  'echo-rtps',
  'echo-tcp',
  'fan-rtps',
  'fan-tcp',
  'showtime_mixed'
];

export const PLOT_TYPES: PlotType[] = [
  'Discovery Time Delta',
  'Cpu Utilization',
  'Memory Utilization',
  'Virtual Memory Utilization',
  'Latency',
  'Jitter',
  'Round Trip Latency',
  'Round Trip Jitter'
];

export const SERVER_COUNTS = ['4', '16'];

export const STATISTICS: (keyof PlotStatistic)[] = [
  'count',
  'min',
  'max',
  'mean',
  'stdev',
  'median',
  'madev',
  'overflow'
];

export const FORM_CONFIGURATION_COMBINATIONS: FormConfiguration[] =
  combinations(SCENARIOS, PLOT_TYPES, STATISTICS, SERVER_COUNTS).map(arr => {
    const [scenario, plotType, statName, serverCount] = arr;
    return {
      scenario,
      plotType,
      statName,
      serverCount
    } as FormConfiguration;
  });

export function formConfigurationTestDescription(
  formConfiguration: FormConfiguration
): string {
  return Object.values(formConfiguration)
    .reduce((acc, value) => {
      acc.push(`${value}`);
      return acc;
    }, [])
    .join(', ');
}
