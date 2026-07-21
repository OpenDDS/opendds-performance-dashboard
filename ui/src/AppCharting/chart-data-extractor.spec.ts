import {
  chartDataFactory,
  getChartDataBySize,
  getChartDataByTimestamp,
  MISSING_VALUE,
  NOT_APPLICABLE_VALUE,
  NOT_RUN_VALUE
} from './chart-data-extractor';

import {mockTimestamp} from '../__mocks__/mock-timestamps';
import {mockBenchmarkMap} from '../__mocks__/mock-benchmarks';
import {
  formConfigurationTestDescription,
  FORM_CONFIGURATION_COMBINATIONS
} from '../__mocks__/shared';

describe('Test Chart Factory', () => {
  test('Test the size function is returned', () => {
    expect(chartDataFactory('by size')).toEqual(getChartDataBySize);
  });

  test('Test the by timestamp function is returned', () => {
    expect(chartDataFactory('by timestamp')).toEqual(getChartDataByTimestamp);
  });
});

describe('Snapshot Chart Data', () => {
  FORM_CONFIGURATION_COMBINATIONS.forEach(formConfiguration => {
    const description = formConfigurationTestDescription(formConfiguration);

    test(`Snspshot of Chart Data By Size for: ${description}`, async () => {
      const data = await getChartDataBySize(mockBenchmarkMap, [mockTimestamp], {
        ...formConfiguration,
        chartType: 'by size',
        useLogScale: false,
        useTimeSeries: false
      });
      expect(data).toMatchSnapshot();
    });

    test(`Test Data Charting By Timestamp : ${description}`, async () => {
      const data = await getChartDataByTimestamp(
        mockBenchmarkMap,
        [mockTimestamp],
        {
          ...formConfiguration,
          chartType: 'by timestamp',
          useLogScale: false,
          useTimeSeries: false
        }
      );
      expect(data).toMatchSnapshot();
    });
  });
});

describe('Special data point states', () => {
  test('distinguishes zero, not applicable, missing, and not run', async () => {
    const scenario = (stat: object) => ({
      scenario_parameters: {Base: 'echo', Config: 'rtps', Bytes: 1024},
      Latency: stat,
      Errors: 0
    });
    const benchmarks = <any>{
      zero: {test: scenario({count: 1, min: 0})},
      not_applicable: {test: scenario({count: 0})},
      missing: {test: scenario({count: 1})},
      not_run: {run_parameters: {}}
    };
    const timestamps = ['zero', 'not_applicable', 'missing', 'not_run'].map(
      (key, index) => <any>{
        ...mockTimestamp,
        key,
        dateTime: `2026-07-21 00:00:0${index}`
      }
    );

    const data = await getChartDataByTimestamp(benchmarks, timestamps, <any>{
      scenario: 'echo-rtps',
      serverCount: 0,
      plotType: 'Latency',
      statName: 'min'
    });

    expect(data.columns[1].slice(1)).toEqual([
      0,
      NOT_APPLICABLE_VALUE,
      MISSING_VALUE,
      NOT_RUN_VALUE
    ]);
  });
});
