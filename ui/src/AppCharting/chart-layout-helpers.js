import {BY_SIZE, BY_TIMESTAMP} from './chart-data-extractor';

export const DEFAULT_CHART_HEIGHT = 500;

export const yAxis = {
  label: {
    position: 'outer-middle',
    text: ''
  },
  min: 0, // helps with log scale
  padding: 0, // helps with log scale
  tick: {
    format(value) {
      return Number.isInteger(value) ? value : value.toFixed(4);
    }
  }
};

export const axisFactory = () => ({
  [BY_SIZE]: {
    x: {
      label: {
        position: 'outer-left'
      },
      type: 'category'
    },
    y: yAxis
  },
  [BY_TIMESTAMP]: {
    x: {
      label: {
        position: 'outer-left',
        text: 'Timestamp'
      },
      //type: 'category',
      tick: {
        culling: false,
        fit: false,
        format: '%Y-%m-%d %H:%M:%S', // display format
        rotate: -90
      }
    },
    y: yAxis
  }
});

//----------------------------------------------------------------------------
// Pure Functions For Chart Data
//----------------------------------------------------------------------------
export function getAxisYLabel({plotType, statName}, {statProperties}) {
  if (!plotType) return '';
  const unit = statProperties[plotType].units;
  return [statName, unit].filter(i => i).join(' ');
}

export function getAxisXLabel({chartType}, {hasNodes}) {
  return chartType === BY_TIMESTAMP
    ? 'timestamp'
    : hasNodes
    ? 'nodes'
    : 'payload size in bytes';
}

export const getLegendTitle = ({chartType}, {hasNodes}) =>
  chartType === BY_SIZE
    ? 'Timestamp'
    : hasNodes
    ? 'Node Count'
    : 'Payload Bytes';

export function getAxisYMin({useLogScale}, {columns}) {
  if (!useLogScale || columns.length === 0) return 0;

  let minY = Number.MAX_VALUE;
  for (const column of columns) {
    const [label] = column;
    if (label !== 'x') {
      // Ignore zero values.
      const values = column.slice(1).filter(v => v !== 0);
      minY = Math.min(minY, ...values);
    }
  }
  return minY;
}

export function getYAxisType({useLogScale}) {
  if (useLogScale) return 'log';
  return 'linear';
}

export function getTimeStampXAxisType({useTimeSeries}) {
  return useTimeSeries ? 'timeseries' : 'category';
}
