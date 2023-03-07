export type AppError = Error & {
  key?: string;
};

/**
 * Unique Identifier representing a combination of Timestamp + Commit Sha + Hash
 * @example "2021-05-28T15:55:19+0000_e0c97e5cd262226fb20ac6cfb5bb4daf888dcaf6_65002d3e2b3e6efa6949dc6e4b4effc8"
 */
export type BenchmarkIdentifier = string;

/**
 * This represents the symbol used to derive size information for the given charts.
 * @example "10" on "disco" represnts nodes, where as "256" on "echo_rtps" represents bytes, or "256_4" on "fan_rtps" represents 256 bytes @ 4 servers
 */
export type ScenarioSizeIdentifier = string;

/**
 * the Commit SHA
 * @example e0c97e5cd262226fb20ac6cfb5bb4daf888dcaf6
 */
export type GitSha = string;

/**
 * the build hash 65002d3e2b3e6efa6949dc6e4b4effc8
 * @example
 */
export type BuildHash = string;

export type Base = 'b1_latency' | 'disco' | 'echo' | 'fan' | 'showtime_mixed';

// leaving in case the type needs to be changed to a similar foramt later
// export interface BaseScenario extends Base =
//   | {b1_latency: ['rtps' | 'tcp' | 'udp']}
//   | {
//       disco: [
//         | 'info-repo'
//         | 'rtps'
//         | 'rtps-multicast'
//         | 'rtps-relay'
//         | 'relay'
//         | 'repo'
//       ];
//     }
//   | {echo: ['rtps' | 'tcp']}
//   | {fan: ['rtps' | 'tcp']}
//   | {showtime_mixed: ['showtime_mixed']};

export type BaseScenario =
  | 'info-repo'
  | 'relay'
  | 'repo'
  | 'rtps'
  | 'rtps-multicast'
  | 'rtps-relay'
  | 'showtime-mixed'
  | 'tcp'
  | 'udp';

export type Scenario =
  | 'b1_latency-rtps'
  | 'b1_latency-tcp'
  | 'b1_latency-udp'
  | 'disco-rtps'
  | 'disco-relay'
  | 'disco-repo'
  | 'echo-rtps'
  | 'echo-tcp'
  | 'fan-rtps'
  | 'fan-tcp'
  | 'showtime_mixed';

export type PlotType =
  | 'Cpu Utilization'
  | 'Discovery Time Delta'
  | 'Jitter'
  | 'Latency'
  | 'Memory Utilization'
  | 'Virtual Memory Utilization'
  | 'Round Trip Latency'
  | 'Round Trip Jitter'
  | 'Round Trip Throughput'
  | 'Throughput';

export type StatName =
  | 'count'
  | 'min'
  | 'max'
  | 'mean'
  | 'stdev'
  | 'median'
  | 'madev'
  | 'overflow';

export type ChartType = 'by size' | 'by timestamp';

export type SelectedTimestamps = Array<BenchmarkIdentifier>;
export type FormConfiguration = {
  base: Base;
  baseScenario: BaseScenario;
  scenario: Scenario;
  statName: StatName;
  plotType: PlotType;
  chartType: ChartType;
  serverCount: number;
  useTimeSeries: boolean;
  useLogScale: boolean;
  latest?: number;
};

export type FormConfigurationKeys = keyof FormConfiguration;
export type FormScenarioOptions = {
  baseScenarios?: string[];
  serverCounts?: number[];
};

export type FormSelectOptions = {
  bases: Partial<Record<Base, FormScenarioOptions>>;
  baseScenarios: Partial<Record<BaseScenario, FormScenarioOptions>>;
  scenarios: Partial<Record<Scenario, FormScenarioOptions>>;
  plotTypes: Array<PlotType>;
  statNames: Array<StatName>;
};

export type StatProperty = {
  units: string;
};

export type StatProperties = Record<PlotType, StatProperty>;

export type Run = {
  key: BenchmarkIdentifier;
  date: string;
  commit: GitSha;
  hash?: BuildHash;
  errors: number;
};

export type RunIndex = Array<Run>;

export type Benchmarks = Record<BenchmarkIdentifier, Benchmark>;

export type IgnoredRunMembers = 'run_parameters';

export type Benchmark = Record<
  Base | Scenario | IgnoredRunMembers,
  ScenarioSizeRecords
>;

export type IgnoredStatistics =
  | 'Errors'
  | 'Max Discovery Time Delta'
  | 'scenario_parameters';

export type ScenarioSizeRecords = Record<
  ScenarioSizeIdentifier,
  PlotTypeRecords
>;

export type PlotTypeRecords = Record<
  PlotType | IgnoredStatistics,
  PlotStatistic
>;

export type PlotStatistic = Record<StatName, number>;

export type GitHubTag = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
};

export type TimestampViewModel = Omit<Run, 'errors'> & {
  date: string;
  time: string;
  dateTime: string;
  errorCount: number;
  tag?: GitHubTag;
};

// some of the types used for the ts helper files

export type Primitive = string | boolean | number | Date | null;
export type PrimitiveArray = Primitive[];
export type XAxisName = 'x';
export type YAxisName = 'y' | 'y2';
export type AxisName = XAxisName | YAxisName;
export type XAxisType = 'timeseries' | 'category' | 'indexed';
export type YAxisType = 'linear' | 'time' | 'timeseries' | 'logarithmic';

export interface YTickConfigurationWithTime extends YTickConfiguration {
  time?:
    | {
        type?: unknown | undefined;
        interval?: unknown | undefined;
      }
    | undefined;
}
export interface YAxisConfigurationWithTime extends YAxisConfiguration {
  tick?: YTickConfigurationWithTime | undefined;
}
export interface AxesOptions {
  /**
   * Switch x and y axis position.
   */
  rotated?: boolean | undefined;
  /** x axis configuration. */
  x?: XAxisConfiguration | undefined;
  /** y axis configuration. */
  y?: YAxisConfigurationWithTime | undefined;
  /** y2 axis configuration. */
  y2?: YAxisConfiguration | undefined;
}

export type FormatFunction = (
  v: number | {valueOf(): number},
  id: string,
  i: number,
  j: number
) => string;
export interface DataSeries {
  id?: string | undefined;
  id_org?: string | undefined;
  values: DataPoint[];
}

export type ArrayOrSingle<T extends any> = T | T[];
export type ArrayOrString = ArrayOrSingle<string>;
export interface XAxisConfiguration extends AxisConfiguration {
  /**
   * Set type of x axis.
   * Defaults to `"indexed"`.
   */
  type?: XAxisType | undefined;
  /**
   * Set how to treat the timezone of x values.
   * If `true` (default), treat x value as localtime. If `false`, convert to UTC internally.
   */
  localtime?: boolean | undefined;
  /**
   * Set category names on category axis.
   * This must be an array that includes category names in string. If category names are included in the date by `data.x` option, this is not required.
   */
  categories?: string[] | undefined;

  tick?: XTickConfiguration | undefined;

  /**
   * Set label on X axis.
   */
  label?:
    | string
    | {
        /** The label text to show. */
        text: string;
        /** The position of the label. */
        position:
          | 'inner-right'
          | 'inner-center'
          | 'inner-left'
          | 'outer-right'
          | 'outer-center'
          | 'outer-left';
      }
    | undefined;

  /**
   * Set height of x axis.
   * The height of x axis can be set manually by this option. If you need more space for x axis, please use this option for that. The unit is pixel.
   */
  height?: number | undefined;
  /**
   * Set default extent for subchart and zoom. This can be an array or function that returns an array.
   */
  extent?: number[] | (() => number[]) | undefined;
  selection?: unknown | undefined;
}

export interface YAxisConfiguration extends AxisConfiguration {
  /**
   * Change the direction of y axis.
   * If true set, the direction will be from the top to the bottom.
   */
  inverted?: boolean | undefined;
  /**
   * Set center value of y axis.
   */
  center?: number | undefined;

  tick?: YTickConfiguration | undefined;

  type?: YAxisType | undefined;

  /**
   * Set label on Y axis.
   */
  label?:
    | string
    | {
        /** The label text to show. */
        text: string;
        /** The position of the label. */
        position:
          | 'inner-top'
          | 'inner-middle'
          | 'inner-bottom'
          | 'outer-top'
          | 'outer-middle'
          | 'outer-bottom';
      }
    | undefined;

  /**
   * Set default range of y axis. This option set the default value for y axis when there is no data on init.
   */
  default?: [number, number] | undefined;

  max?: number | undefined;
  min?: number | undefined;
}

export interface AxisConfiguration {
  /**
   * Show or hide the axis.
   */
  show?: boolean | undefined;
  /**
   * Set padding for axis.
   * If this option is set, the range of axis will increase/decrease according to the values. If no padding is needed in the range of axis, `0` should be set. On category axis, this option
   * will be ignored.
   */
  padding?: Padding | undefined;
  /**
   * Set max value of the axis.
   */
  max?: string | number | Date | undefined;
  /**
   * Set min value of the axis.
   */
  min?: string | number | Date | undefined;
  /**
   * Show the axis inside of the chart.
   */
  inner?: boolean | undefined;
}

export interface Padding extends SidePadding {
  /** Top padding. */
  top?: number | undefined;
  /** Bottom padding. */
  bottom?: number | undefined;
}

export interface SidePadding {
  /** Right padding. */
  right?: number | undefined;
  /** Left padding. */
  left?: number | undefined;
}

export interface XTickConfiguration extends TickConfiguration {
  /**
   * A function to format x-axis tick values. A format string is also supported for timeseries data.
   */
  format?: string | ((x: number | Date) => string | number) | undefined;

  /**
   * Centerise ticks on category axis
   */
  centered?: boolean | undefined;
  /**
   * Setting for culling ticks.
   * If `true` is set, the ticks will be culled, then only limitted tick text will be shown.
   * This option does not hide the tick lines. If `false` is set, all of ticks will be shown.
   */
  culling?:
    | boolean
    | {
        /**
         * The number of tick texts will be adjusted to less than this value.
         */
        max: number;
      }
    | undefined;
  /**
   * Fit x axis ticks.
   * If `true` set, the ticks will be positioned nicely. If `false` set, the ticks will be positioned
   * according to x value of the data points.
   */
  fit?: boolean | undefined;
  /**
   * Set width of x axis tick.
   */
  width?: number | undefined;
  multiline?: boolean | undefined;
  multilineMax?: number | undefined;
}

export interface YTickConfiguration extends TickConfiguration {
  /**
   * A function to format y-axis tick values.
   */
  format?: ((x: number) => string | number) | undefined;
}

export interface DataPoint {
  x: number;
  value: number;
  id: string;
  index: number;
}
export interface TickConfiguration {
  /**
   * Show x axis outer tick.
   */
  outer?: boolean | undefined;
  /**
   * Set the x values of ticks manually.
   * If this option is provided, the position of the ticks will be determined based on those values. This option works with timeseries data and the x values will be parsed accoding to the type
   * of the value and data.xFormat option.
   */
  values?: number[] | string[] | undefined;
  /**
   * Rotate x axis tick text. If you set negative value, it will rotate to opposite direction.
   */
  rotate?: number | undefined;
  /**
   * The number of x axis ticks to show.
   * This option hides tick lines together with tick text. If this option is used on timeseries axis, the ticks position will be determined precisely and not nicely positioned (e.g. it will
   * have rough second value).
   */
  count?: number | undefined;
}

export interface Data {
  /**
   * Load a CSV or JSON file from a URL. Note that this will not work if loading via the `"file://"` protocol as most browsers with block `XMLHTTPRequests`.
   */
  url?: string | undefined;
  /**
   * Specify headers for the data request if `data.url` is provided.
   */
  headers?: unknown | undefined;
  /**
   * Parse a JSON object for data. Can be in the column form `{key1: [val1, val2, ...]; ...}` or in the row form `[{key1: val1; key2: val2}, ...]`. If `url` is provided this will be ignored.
   */
  json?:
    | Record<string, PrimitiveArray>
    | Array<Record<string, Primitive>>
    | undefined;
  /**
   * A list of rows, where the first row is the column names and the remaining rows are data.  If `url` or `json` are provided this will be ignored.
   */
  rows?: PrimitiveArray[] | undefined;
  /**
   * A list of columns, where the first element in each column is the ID and the remaining elements are data. If `url`, `json`, or `rows` are provided, this will be ignored.
   */
  columns?: Array<[string, ...PrimitiveArray]> | undefined;
  /**
   * Used if loading JSON via `data.url`.
   */
  mimeType?: string | undefined;
  /**
   * If `data.json` is provided and is in row form, these keys are used to pull the data from each row.
   */
  keys?:
    | {
        /** This is the key for the x-value in each row. */
        x?: string | undefined;
        /** List of remaining keys (besides the x key) to pull data for. */
        value: string[];
      }
    | undefined;
  /**
   * Specify the key of x values in the data.
   * We can show the data with non-index x values by this option. This option is required when the type of x axis is timeseries. If this option is set on category axis, the values of the data
   * on the key will be used for category names.
   */
  x?: string | undefined;
  /**
   * Specify the keys of the x values for each data.
   * This option can be used if we want to show the data that has different x values.
   */
  xs?: {[key: string]: string} | undefined;
  /**
   * Set a format to parse string specifed as x.
   * Default is `"%Y-%m-%d"`.
   * @see https://github.com/d3/d3-time-format#locale_format For a list of valid format specifiers.
   */
  xFormat?: string | undefined;
  /**
   * Set to `true` to parse dates and times as local time.
   * **Experimental.**
   */
  xLocaltime?: boolean | undefined;
  /**
   * Set to `true` to sort x values.
   * **Experimental.**
   */
  xSort?: boolean | undefined;
  /**
   * Set custom data display names.
   */
  names?: {[key: string]: string} | undefined;
  /**
   * Set custom data classes for styling.
   * If this option is specified, the element g for the data has an additional class that has the prefix `c3-target-` (e.g. `c3-target-additional-data1-class`).
   */
  classes?: {[key: string]: string} | undefined;
  /**
   * Set groups for the data for stacking.
   */
  groups?: string[][] | undefined;
  /**
   * Set y axis the data related to.
   */
  axes?: {[key: string]: AxisName} | undefined;
  /**
   * Set chart type at once.
   * If this option is specified, the type will be applied to every data. This setting can be overwritten for individual data by `data.types`.
   */
  type?: ChartType | undefined;
  /**
   * Set chart type for each data.
   * This setting overwrites the chart-wide `data.type` setting.
   */
  types?: {[key: string]: ChartType} | undefined;
  /**
   * Show labels on each data points or set formatter function for data labels.
   * Control all labels with a boolean value or `format` function, or control behavior for individual data with a `format` object.
   */
  labels?:
    | boolean
    | {format: FormatFunction}
    | {format: {[key: string]: boolean | FormatFunction}}
    | undefined;
  /**
   * Define the order of the data.
   * This option changes the order of stacking the data and pieces of pie/donut. If null specified, it will be the order the data loaded. If function specified, it will be used to sort the data
   * and it will recieve the data as argument.
   */
  order?:
    | 'asc'
    | 'desc'
    | ((...data: DataSeries[]) => number)
    | null
    | undefined;
  /**
   * Set color converter function.
   * The function is called for each data ID, for each data series, and for each individual point.
   */
  color?:
    | ((
        color: string,
        d: string | DataSeries | DataPoint
      ) => string | d3.RGBColor | d3.HSLColor)
    | undefined;
  /**
   * Set color for each data.
   * If a function is specified, it is called once each with the data ID, the data series, and each point.
   */
  colors?:
    | {
        [key: string]:
          | string
          | d3.RGBColor
          | d3.HSLColor
          | ((
              d: string | DataSeries | DataPoint
            ) => string | d3.RGBColor | d3.HSLColor);
      }
    | undefined;
  /**
   * Hide each data when the chart appears.
   * If true specified, all of data will be hidden. If multiple ids specified as an array, those will be hidden.
   */
  hide?: boolean | string[] | undefined;
  /**
   * Specify a filter function to selectively load data.
   * @param series The data series for which to decide whether to show or not.
   * @param index The index of the data series in the data.
   * @param allSeries Array of all data series, whether filtered or not.
   * @returns `true` if the series should be shown, `false` if it should be hidden.
   */
  filter?:
    | ((series: DataSeries, index: number, allSeries: DataSeries[]) => boolean)
    | undefined;
  /**
   * Set text displayed when empty data.
   * Defaults to `""`.
   */
  empty?: {label: {text: string}} | undefined;

  selection?:
    | {
        /**
         * Enable or disable selecting data.
         * If this option is set `true`, we can select the data points and get/set its state of selection by API (e.g. `select`, `unselect`, `selected`).
         * Defaults to `false`.
         */
        enabled?: boolean | undefined;
        /**
         * Set grouped selection enabled.
         * If this option set `true`, multiple data points that have same x value will be selected by one selection.
         * Defaults to `false`.
         */
        grouped?: boolean | undefined;
        /**
         * Set multiple data points selection enabled.
         * If this option set `true`, multiple data points can have the selected
         * state at the same time. If `false` set, only one data point can have
         * the selected state and the others will be unselected when the new data point is selected.
         */
        multiple?: boolean | undefined;
        /**
         * Enable to select data points by dragging.
         * If this option set `true`, data points can be selected by dragging.
         *
         * **Note**: If this option set `true`, scrolling on the chart will be disabled because dragging event will handle the event.
         */
        draggable?: boolean | undefined;
        /**
         * Prevent specific data from being selected. Only called if `selection.enabled` is `true`.
         * @param d The data series to decide for.
         * @returns `false` if selection should be disabled for this data.
         */
        isselectable?(this: Record<string, any>, d: DataSeries): boolean;
      }
    | undefined;
  stack?:
    | {
        /**
         * Set the stacking to be normalized. Default is false.
         *
         * **Note**: For stacking, the `data.groups` option should be set and have positive values. The yAxis will be set in percentage value (0 ~ 100%).
         */
        normalize?: boolean | undefined;
      }
    | undefined;
  epochs?: string | undefined;

  /**
   * Convert data IDs with this function before creating chart.
   * @param id The original ID string.
   * @returns The converted ID string.
   */
  idConverter?(id: string): string;
}
