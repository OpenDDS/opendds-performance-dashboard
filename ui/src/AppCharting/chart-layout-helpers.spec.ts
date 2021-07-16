import {
  getAxisXLabel,
  getAxisYLabel,
  getAxisYMin
} from './chart-layout-helpers';
import {mockStatProperites} from '../__mocks__/mock-stat-properties';
import {mockTimestamp} from '../__mocks__/mock-timestamps';
import {mockBenchmarkMap} from '../__mocks__/mock-benchmarks';
import {
  formConfigurationTestDescription,
  FORM_CONFIGURATION_COMBINATIONS
} from '../__mocks__/shared';

import {getChartDataBySize} from './chart-data-extractor';

describe('Chart Layout:', () => {
  FORM_CONFIGURATION_COMBINATIONS.forEach(formConfiguration => {
    const description = formConfigurationTestDescription(formConfiguration);
    test(`Snapshot Axis Y Label for: ${description}`, async () => {
      const axis = getAxisYLabel(formConfiguration, {
        statProperties: mockStatProperites
      });
      expect(axis).toMatchSnapshot();
    });

    test(`Snapshot Axis Y Min for: ${formConfigurationTestDescription(
      formConfiguration
    )}`, async () => {
      const {columns} = await getChartDataBySize(
        mockBenchmarkMap,
        [mockTimestamp],
        formConfiguration
      );

      const min = getAxisYMin(formConfiguration, {
        columns
      });

      expect(min).toMatchSnapshot();
    });

    test(`Snapshot Axis X Label for: ${description}`, async () => {
      const axis = getAxisXLabel(formConfiguration, {
        hasNodes: false
      });
      expect(axis).toMatchSnapshot();
    });
  });
});
