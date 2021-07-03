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

export type Scenario = string;
export type StatName = string;
export type PlotType = string;
export type ChartType = 'by size' | 'by timestamp';

export type FormConfiguration = {
  scenario: Scenario;
  statName: StatName;
  plotType: PlotType;
  chartType: ChartType;
  serverCount: number;
  useTimeSeries: boolean;
  useLogScale: boolean;
  selectedTimestamps?: Array<BenchmarkIdentifier>;
  latest?: number;
};

export type FormSelectOptions = {
  scenarios: Array<Scenario>;
  allPlotTypes: Array<PlotType>;
  statNames: Array<StatName>;
  serverCountMap: Record<Scenario, Array<number>>;
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

export type PlotStatKeys =
  | 'count'
  | 'min'
  | 'max'
  | 'mean'
  | 'stdev'
  | 'median'
  | 'madev'
  | 'overflow';
export type SizeRecordKeys = 'Errors' | 'Max Discovery Time Delta';

export type PlotStatistic = Record<PlotStatKeys, number>;
export type PlotEntries = Record<PlotType, PlotStatistic>;

export type SizeRecordEntry = Record<PlotStatKeys | SizeRecordKeys, number>;

export type SizeRecord = Record<ScenarioSizeIdentifier, SizeRecordEntry>;

export type Benchmark = Record<Scenario, SizeRecord>;

export type Benchmarks = Record<BenchmarkIdentifier, Benchmark>;

export type GitHubTag = {
  name: string;
  commit: string;
};

export type TimestampViewModel = Omit<Run, 'errors'> & {
  date: string;
  time: string;
  dateTime: string;
  errorCount: number;
  tag?: GitHubTag;
};
