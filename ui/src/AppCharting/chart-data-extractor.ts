import type {Data, PrimitiveArray} from 'c3';
import type {
  BenchmarkIdentifier,
  Benchmarks,
  ChartType,
  FormConfiguration,
  PlotStatistic,
  Scenario,
  ScenarioSizeRecords,
  PlotTypeRecords,
  TimestampViewModel
} from '../types';

export const MISSING_VALUE = -0.0000001;
export const BY_SIZE: ChartType = 'by size';
export const BY_TIMESTAMP: ChartType = 'by timestamp';

/**
 * An Array of strings or numbers used in C3 Charts
 * @link C3 Types https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/c3/index.d.ts
 */
export type ChartingArray = [string, ...PrimitiveArray];

/**
 * An Array of Arrays of string | numbers use in C3 Charts
 * @link C3 Types https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/c3/index.d.ts
 */
export type ChartingColumns = Array<ChartingArray>;

/**
 * Chart Data Strucutre for C3 Charts
 * @link C3 Types https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/c3/index.d.ts
 */
export type ChartFactoryData = Data;

export type ChartFactoryCallback = (
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
) => Promise<Data>;

const FUNCTION_MAP: Record<ChartType, ChartFactoryCallback> = {
  [BY_TIMESTAMP]: getChartDataByTimestamp,
  [BY_SIZE]: getChartDataBySize
};


export function chartDataFactory(type: ChartType): ChartFactoryCallback {
  const fn = FUNCTION_MAP[type];
  if (!fn) throw new Error(`Chart data for ${type} is not currently supported`);

  return async (
    benchmarkMap: Benchmarks,
    timestamps: TimestampViewModel[],
    opts: FormConfiguration
  ): Promise<Data> => {
    const data = await fn(benchmarkMap, timestamps, opts);
    return mutating_assignNames(data);
  };
}

export function classNameFromBenchmarkKey(key: BenchmarkIdentifier): string {
  const [date] = key.split('_');
  const split = date.split('+');
  if (!split.length) return '';
  const first: string = split[0];

  return first.replaceAll('T', '_').replaceAll(':', '-');
}

export function classNameToDateTime(text: string): string {
  const [date, time] = text.split('_');
  const newTime = time.replaceAll('-', ':');
  return date + ' ' + newTime;
}

export function getChartDataBySize(
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  const isFan = isFanScenario(scenario);
  const data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return Promise.resolve(data);

  const sizes = getSizeKeys(benchmarkMap, {scenario, serverCount});
  const arr: ChartingArray = ['x', ...sizes];
  const columns: ChartingColumns = [arr];

  for (const timestamp of timestamps) {
    const column: ChartingArray = [classNameFromBenchmarkKey(timestamp.key)];

    for (const size of sizes) {
      let value: number = MISSING_VALUE;
      const sizeKey = isFan ? `${size}_${serverCount}` : size;
      const benchmark = benchmarkMap[timestamp.key];
      const scenarioSizeRecords: ScenarioSizeRecords | boolean =
        benchmark && benchmark[scenario];
      if (scenarioSizeRecords) {
        const plotTypeRecords: PlotTypeRecords = scenarioSizeRecords[sizeKey];
        if (plotTypeRecords) {
          const plotStatistic: PlotStatistic = plotTypeRecords[plotType];
          if (plotStatistic && plotStatistic[statName])
            value = plotStatistic[statName];
        }
      }

      column.push(value);
    }
    columns.push(column);
  }

  return Promise.resolve({...data, columns});
}

export function getChartDataByTimestamp(
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  const data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return Promise.resolve(data);
  const isFan: boolean = isFanScenario(scenario);
  // Load Data For Selected TimeStamps

  const xValues: PrimitiveArray = timestamps.map(
    timestamp => timestamp.dateTime
  );
  const arr: ChartingArray = ['x', ...xValues];
  const columns: ChartingColumns = [arr];

  const dataNames: string[] = getDataNames(benchmarkMap, {
    scenario,
    serverCount
  });

  for (const dataName of dataNames) {
    const column: ChartingArray = [dataName];

    for (const timestamp of timestamps) {
      let value = 0;
      const benchmark = benchmarkMap[timestamp.key];
      const scenarioSizeRecords = benchmark && benchmark[scenario];
      if (benchmark) {
        const plotTypeRecords =
          scenarioSizeRecords[isFan ? `${dataName}_${serverCount}` : dataName];
        if (plotTypeRecords) {
          const plotStatisctics = plotTypeRecords[plotType];
          if (plotStatisctics) value = plotStatisctics[statName];
        }
      }
      column.push(value);
    }

    columns.push(column);
  }

  const xFormat = '%Y-%m-%d %H:%M:%S'; // date format
  return Promise.resolve({...data, columns, xFormat});
}

export function getDataNames(
  benchmarkMap: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): string[] {
  const isFan = isFanScenario(scenario);
  const dataNames = new Set<string>();
  for (const benchmark of Object.values(benchmarkMap)) {
    const scenarioSizeRecords = benchmark[scenario];
    if (scenarioSizeRecords) {
      for (const dataName of Object.keys(scenarioSizeRecords)) {
        if (!isFan || dataName.endsWith(`_${serverCount}`)) {
          dataNames.add(isFan ? dataName.split('_')[0] : dataName);
        }
      }
    }
  }
  return [...dataNames].sort((n1, n2) => Number(n1) - Number(n2));
}

export function getSizeKeys(
  benchmarkMap: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): string[] {
  const isFan = isFanScenario(scenario);
  const sizes = new Set<string>();

  for (const benchmark of Object.values(benchmarkMap)) {
    const scenarioSizeRecords = benchmark[scenario];
    if (scenarioSizeRecords) {
      for (const scenarioSize of Object.keys(scenarioSizeRecords)) {
        if (!isFan || scenarioSize.endsWith(`_${serverCount}`)) {
          sizes.add(isFan ? scenarioSize.split('_')[0] : scenarioSize);
        }
      }
    }
  }

  return [...sizes].sort((n1, n2) => Number(n1) - Number(n2));
}

export function isFanScenario(scenario: Scenario): boolean {
  return (scenario || '').startsWith('fan_');
}

//----------------------------------------------------------------
// Internals
//------------------------------------------------------------
function mutating_assignNames(data: Data): Data {
  data.names = {};
  if (!data.columns) return data;
  for (const column of data.columns) {
    const name = column[0];
    if (name.includes('_')) data.names[name] = classNameToDateTime(name);
  }
  return data;
}
