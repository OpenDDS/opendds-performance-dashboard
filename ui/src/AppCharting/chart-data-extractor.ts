import type {Data, PrimitiveArray} from 'c3';
import type {
  BenchmarkIdentifier,
  Benchmarks,
  ChartType,
  FormConfiguration,
  Scenario,
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
  collectedData: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
) => Promise<Data>;

const FUNCTION_MAP: Record<ChartType, ChartFactoryCallback> = {
  [BY_TIMESTAMP]: getChartDataByTimestamp,
  [BY_SIZE]: getChartDataBySize
};

export function classNameFromBenchmarkKey(key: BenchmarkIdentifier): string {
  const [date] = key.split('_');
  return date.split('+')[0].replaceAll('T', '_').replaceAll(':', '-');
}

export function classNameToDateTime(text: string): string {
  const [date, time] = text.split('_');
  const newTime = time.replaceAll('-', ':');
  return date + ' ' + newTime;
}

export function chartDataFactory(type: ChartType) {
  const fn = FUNCTION_MAP[type];
  if (!fn) throw new Error(`Chart data for ${type} is not currently supported`);

  return async (
    collectedData: Benchmarks,
    timestamps: TimestampViewModel[],
    opts: FormConfiguration
  ) => {
    const data = await fn(collectedData, timestamps, opts);
    return mutating_assignNames(data);
  };
}

export async function getChartDataBySize(
  collectedData: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  const isFan = isFanScenario(scenario);
  let data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return data;

  const sizes = getSizes(collectedData, {scenario, serverCount});
  const arr: ChartingArray = ['x', ...sizes];
  const columns: ChartingColumns = [arr];

  for (const timestamp of timestamps) {
    const column: ChartingArray = [classNameFromBenchmarkKey(timestamp.key)];
    for (const size of sizes) {
      let value: number = MISSING_VALUE;
      const key = isFan ? size + '_' + serverCount : size;
      const dataPoint = collectedData[timestamp.key];
      let obj = dataPoint && dataPoint[scenario];
      if (obj) {
        let objVal = obj[key];
        if (objVal) {
          const stats = objVal[plotType];
          if (stats) value = stats[statName];
        }
      }

      column.push(value);
    }
    columns.push(column);
  }

  return {...data, columns};
}

export async function getChartDataByTimestamp(
  collectedData: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  let data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return data;
  const isFan: boolean = isFanScenario(scenario);
  // Load Data For Selected TimeStamps

  const xValues: PrimitiveArray = timestamps.map(
    timestamp => timestamp.dateTime
  );
  const arr: ChartingArray = ['x', ...xValues];
  const columns: ChartingColumns = [arr];

  const dataNames: string[] = getDataNames(collectedData, {
    scenario,
    serverCount
  });

  for (const dataName of dataNames) {
    const column: ChartingArray = [dataName];

    for (const timestamp of timestamps) {
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

  const xFormat = '%Y-%m-%d %H:%M:%S'; // date format
  return {...data, columns, xFormat};
}

export function getDataNames(
  collectedData: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): string[] {
  const isFan = isFanScenario(scenario);
  const dataNames = new Set<string>();
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

export function getSizes(
  collectedData: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): (string | number)[] {
  const isFan = isFanScenario(scenario);
  const sizes = new Set<string>();

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

export function isFanScenario(scenario: Scenario): boolean {
  return (scenario || '').startsWith('fan_');
}

//----------------------------------------------------------------
// Internals
//------------------------------------------------------------
function mutating_assignNames(data: Data): Data {
  data.names = {};
  for (const column of data.columns) {
    const name = <string>column[0];
    if (name.includes('_')) data.names[name] = classNameToDateTime(name);
  }
  return data;
}
