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

export type Scenario =
  | 'b1_latency_rtps'
  | 'b1_latency_tcp'
  | 'b1_latency_udp'
  | 'disco'
  | 'echo_rtps'
  | 'echo_tcp'
  | 'fan_rtps'
  | 'fan_tcp'
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
  serverCounts: number[];
};

export type FormSelectOptions = {
  scenarios: Partial<Record<Scenario, FormScenarioOptions>>;
  allPlotTypes: Array<PlotType>;
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

export type Benchmark = Record<Scenario, ScenarioSizeRecords>;

export type IgnoredStatistics = 'Errors' | 'Max Discovery Time Delta';

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
