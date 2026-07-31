import {
  axisFactory,
  getAxisXLabel,
  getAxisYConfigurationPartials,
  getAxisYLabel,
  getAxisYTickFormat
} from './chart-layout-helpers';
import {mockStatProperites} from '../__mocks__/mock-stat-properties';

import {
  formConfigurationTestDescription,
  FORM_CONFIGURATION_COMBINATIONS
} from '../__mocks__/shared';

describe('Chart Layout:', () => {
  test('uses consistent precision for unitless axis ticks', () => {
    const format = axisFactory()['by size'].y.tick.format;
    expect(format(0.6)).toBe('0.6000');
    expect(format(1)).toBe('1.0000');
  });

  test('labels sub-second time charts in milliseconds', () => {
    const form = {
      ...FORM_CONFIGURATION_COMBINATIONS[0],
      plotType: 'Latency',
      statName: 'Median'
    };
    const columns = [['x', 1024], ['series', 0.35]];

    expect(
      getAxisYLabel(form, {statProperties: mockStatProperites, columns})
    ).toBe('Median milliseconds');
    expect(
      getAxisYTickFormat(form, {
        statProperties: mockStatProperites,
        columns
      })(0.35)
    ).toBe('350.00ms');
  });

  test('labels longer time charts in seconds', () => {
    const form = {
      ...FORM_CONFIGURATION_COMBINATIONS[0],
      plotType: 'Discovery Time Delta',
      statName: 'Median'
    };
    const columns = [['x', 60], ['series', 4]];

    expect(
      getAxisYLabel(form, {statProperties: mockStatProperites, columns})
    ).toBe('Median seconds');
    expect(
      getAxisYTickFormat(form, {
        statProperties: mockStatProperites,
        columns
      })(4)
    ).toBe('4.000s');
  });

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
