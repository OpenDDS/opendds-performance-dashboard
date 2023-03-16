import type {
  // Base,
  BaseScenario,
  BenchmarkIdentifier,
  Benchmarks,
  ChartType,
  Data,
  FormConfiguration,
  PlotStatistic,
  PrimitiveArray,
  Scenario,
  TimestampViewModel
  // XAxisAndLegendOptions
} from '../types';
import {configParamMap, sizeParamMap} from '../utility/param-map';

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

// const FUNCTION_MAP: Record<ChartType, ChartFactoryCallback> = {
//   [BY_TIMESTAMP]: getChartData,
//   [BY_SIZE]: getChartData
// };

// export function xAxisDataFactory(
//   type: XAxisAndLegendOptions
// ): ChartFactoryCallback {
//   const fn = getXAxisAndLegendOptions;
//   if (!fn)
//     throw new Error(`X-Axis data for ${type} is not currently supported`);
//   return fn;
// }

export function chartDataFactory(): ChartFactoryCallback {
  // const fn = FUNCTION_MAP[type];
  return getChartData;
  // if (!fn) throw new Error(`Chart data for ${type} is not currently supported`);
}

export function classNameFromBenchmarkKey(key: BenchmarkIdentifier): string {
  const [date] = key.split('_');
  const split = date.split('+');

  if (!split.length) return '';
  const first: string = split[0];

  return first.replace(/T/g, '_').replace(/:/g, '-');
}

export function classNameToDateTime(text: string): string {
  const [date, time] = text.split('_');
  const newTime = time.replace(/-/g, ':');
  return date + ' ' + newTime;
}

export function getConfigOptions(data) {
  let configOptions = new Set<BaseScenario>();

  let store = data;

  if (store && store['columns']) {
    store['columns'].forEach(option => {
      const key = Object.keys(option)[0];
      let data = option[key];
      data = data.map(item => {
        if (item.config !== 'undefined') configOptions.add(item.config);
      });
    });
  }

  return [...configOptions];
}

export function getXAxisAndLegendOptions(data) {
  let options = new Set();

  let store = data;
  console.log('getXAxisAndLegendOptions', {store});

  if (store && store['columns']) {
    store['columns'].forEach(option => {
      const key = Object.keys(option)[0];
      let data = option[key];
      data = data.map(item => {
        let res = item.data['scenario_parameters'];
        res = Object.keys(res).filter(key => key !== 'Base');
        res.forEach(item => options.add(item));
      });
    });
    options.add('Timestamp');
  }

  return [...options];
}

export async function getChartData(
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
) {
  const {scenario, plotType, statName} = opts;
  const data: Data = {};
  // const isFan = isFanScenario(scenario);

  if (!benchmarkMap || !scenario || !statName || !plotType) return data;

  const columns = [];

  for (const timestamp of timestamps) {
    const date = classNameFromBenchmarkKey(timestamp.key);
    const column = {};
    column[date] = [];
    const benchmark = benchmarkMap[timestamp.key];
    if (benchmark) {
      for (const [, sData] of Object.entries(benchmark).filter(
        ([key]) => key != 'run_parameters'
      )) {
        const sParams = sData['scenario_parameters'];
        if (sParams) {
          const sBase = sParams['Base'];
          const sConfig = sParams['Config'];
          column[date].push({base: sBase, config: sConfig, data: sData});
          // TODO: add server count to data
          // const sServers = sParams['Servers'];
          // const serverMatch =
          //   !isFan ||
          //   (sServers &&
          //     JSON.stringify(sServers) === JSON.stringify(serverCount));
          // const sSize = sParams[sizeParamMap[sBase]];
          // const sizeMatch = sSize && JSON.stringify(sSize) === size;
          // if (sName === scenario && serverMatch && sizeMatch) {
          //   const plotStatistic: PlotStatistic = <PlotStatistic>(
          //     (<unknown>sData[plotType])
          //   );
          //   if (plotStatistic && plotStatistic[statName]) {
          //     value = plotStatistic[statName];
          //   }
          // }
        }
      }
    }
    columns.push(column);
  }

  return {...data, columns};
}

export async function getChartDataBySize(
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  const data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return data;

  const isFan = isFanScenario(scenario);

  const sizes = getSizeKeys(benchmarkMap, {scenario, serverCount});

  const arr: ChartingArray = ['x', ...sizes];
  const columns: ChartingColumns = [arr];

  for (const timestamp of timestamps) {
    const column: ChartingArray = [classNameFromBenchmarkKey(timestamp.key)];

    for (const size of sizes) {
      let value: number = MISSING_VALUE;
      const benchmark = benchmarkMap[timestamp.key];
      if (benchmark) {
        for (const [, sData] of Object.entries(benchmark).filter(
          ([key]) => key != 'run_parameters'
        )) {
          const sParams = sData['scenario_parameters'];
          if (sParams) {
            const sBase = sParams['Base'];
            const sConfig = sParams['Config'];
            const sName = sConfig
              ? sBase +
                '-' +
                (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
              : sBase;
            const sServers = sParams['Servers'];
            const serverMatch =
              !isFan ||
              (sServers &&
                JSON.stringify(sServers) === JSON.stringify(serverCount));
            const sSize = sParams[sizeParamMap[sBase]];
            const sizeMatch = sSize && JSON.stringify(sSize) === size;
            if (sName === scenario && serverMatch && sizeMatch) {
              const plotStatistic: PlotStatistic = <PlotStatistic>(
                (<unknown>sData[plotType])
              );
              if (plotStatistic && plotStatistic[statName]) {
                value = plotStatistic[statName];
              }
            }
          }
        }
      }
      column.push(value);
    }
    columns.push(column);
  }

  return mutating_assignNames({...data, columns});
}

export async function getChartDataByTimestamp(
  benchmarkMap: Benchmarks,
  timestamps: TimestampViewModel[],
  opts: FormConfiguration
): Promise<Data> {
  const {scenario, serverCount, plotType, statName} = opts;
  const data: Data = {columns: [], x: 'x', names: {}};

  if (!scenario || !statName || !plotType) return data;

  const isFan: boolean = isFanScenario(scenario);

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
      let value: number = MISSING_VALUE;
      const benchmark = benchmarkMap[timestamp.key];
      if (benchmark) {
        for (const [, sData] of Object.entries(benchmark).filter(
          ([key]) => key != 'run_parameters'
        )) {
          const sParams = sData['scenario_parameters'];
          if (sParams) {
            const sBase = sParams['Base'];
            const sConfig = sParams['Config'];
            const sName = sConfig
              ? sBase +
                '-' +
                (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
              : sBase;
            const sServers = sParams['Servers'];
            const serverMatch =
              !isFan ||
              (sServers &&
                JSON.stringify(sServers) === JSON.stringify(serverCount));
            const sSize = sParams[sizeParamMap[sBase]];
            const sizeMatch = sSize && JSON.stringify(sSize) === dataName;
            if (sName === scenario && serverMatch && sizeMatch) {
              const plotStatistic: PlotStatistic = <PlotStatistic>(
                (<unknown>sData[plotType])
              );
              if (plotStatistic && plotStatistic[statName]) {
                value = plotStatistic[statName];
              }
            }
          }
        }
      }

      column.push(value);
    }
    columns.push(column);
  }

  const xFormat = '%Y-%m-%d %H:%M:%S'; // date format
  return mutating_assignNames({...data, columns, xFormat});
}

export function getDataNames(
  benchmarkMap: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): string[] {
  const isFan = isFanScenario(scenario);
  const dataNames = new Set<string>();

  for (const benchmark of Object.values(benchmarkMap)) {
    for (const [, sData] of Object.entries(benchmark).filter(
      ([key]) => key != 'run_parameters'
    )) {
      const sParams = sData['scenario_parameters'];
      if (sParams) {
        const sBase = sParams['Base'];
        const sConfig = sParams['Config'];
        const sName = sConfig
          ? sBase +
            '-' +
            (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
          : sBase;
        const sServers = sParams['Servers'];
        const serverMatch =
          !isFan ||
          (sServers &&
            JSON.stringify(sServers) === JSON.stringify(serverCount));
        if (sName === scenario && serverMatch) {
          dataNames.add(JSON.stringify(sParams[sizeParamMap[sBase]]));
        }
      }
    }
  }

  const result = [...dataNames].sort((n1, n2) => Number(n1) - Number(n2));
  //console.log("getDataNames is returning result: ", result);
  return result;
}

export function getSizeKeys(
  benchmarkMap: Benchmarks,
  {scenario, serverCount}: Pick<FormConfiguration, 'scenario' | 'serverCount'>
): string[] {
  const isFan = isFanScenario(scenario);
  const sizes = new Set<string>();

  for (const benchmark of Object.values(benchmarkMap)) {
    for (const [, sData] of Object.entries(benchmark).filter(
      ([key]) => key != 'run_parameters'
    )) {
      const sParams = sData['scenario_parameters'];
      if (sParams) {
        const sBase = sParams['Base'];
        const sConfig = sParams['Config'];
        const sName = sConfig
          ? sBase +
            '-' +
            (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
          : sBase;
        const sServers = sParams['Servers'];
        const serverMatch =
          !isFan ||
          (sServers &&
            JSON.stringify(sServers) === JSON.stringify(serverCount));
        if (sName === scenario && serverMatch) {
          sizes.add(JSON.stringify(sParams[sizeParamMap[sBase]]));
        }
      }
    }
  }

  const result = [...sizes].sort((n1, n2) => Number(n1) - Number(n2));
  return result;
}

export function isFanScenario(scenario: Scenario): boolean {
  return (scenario || '').startsWith('fan-');
}

//----------------------------------------------------------------
// Internals
//------------------------------------------------------------
function mutating_assignNames(data: Data) {
  data.names = {};
  if (!data.columns) return data;
  for (const column of data.columns) {
    const name = column[0];
    if (name.includes('_')) data.names[name] = classNameToDateTime(name);
  }
  return data;
}
