import {
  chartDataFactory,
  getChartDataBySize,
  getChartDataByTimestamp
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
