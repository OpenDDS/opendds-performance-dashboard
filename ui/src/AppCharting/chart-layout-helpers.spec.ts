import {
  getAxisXLabel,
  getAxisYConfigurationPartials,
  getAxisYLabel
} from './chart-layout-helpers';
import {mockStatProperites} from '../__mocks__/mock-stat-properties';

import {
  formConfigurationTestDescription,
  FORM_CONFIGURATION_COMBINATIONS
} from '../__mocks__/shared';

describe('Chart Layout:', () => {
  FORM_CONFIGURATION_COMBINATIONS.forEach(formConfiguration => {
    const description = formConfigurationTestDescription(formConfiguration);
    test(`Snapshot Axis Y Label for: ${description}`, async () => {
      const axis = getAxisYLabel(formConfiguration, {
        statProperties: mockStatProperites
      });
      expect(axis).toMatchSnapshot();
    });

    test(`Snapshot Axis Y Configuration Partials for: ${formConfigurationTestDescription(
      formConfiguration
    )}`, async () => {
      const partials = getAxisYConfigurationPartials(formConfiguration);

      expect(partials).toMatchSnapshot();
    });

    test(`Snapshot Axis X Label for: ${description}`, async () => {
      const axis = getAxisXLabel(formConfiguration, {
        hasNodes: false
      });
      expect(axis).toMatchSnapshot();
    });
  });
});
