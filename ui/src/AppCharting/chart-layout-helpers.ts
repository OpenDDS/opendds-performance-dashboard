import type {
  XAxisConfiguration,
  XAxisType,
  YAxisConfiguration,
  YAxisType
} from 'c3';
import type {ChartType, FormConfiguration, StatProperties} from '../types';
import {BY_SIZE, BY_TIMESTAMP, ChartFactoryData} from './chart-data-extractor';

type HasStatPropertiesOptions = {statProperties: StatProperties};
type HasColumnsOptions = Pick<ChartFactoryData, 'columns'>;
type HasNodesOptions = {hasNodes: boolean};
type HasLogScaleOptions = Pick<FormConfiguration, 'useLogScale'>;
type HasUseTimeSeriesOptions = Pick<FormConfiguration, 'useTimeSeries'>;

export const DEFAULT_CHART_HEIGHT = 500;

export const yAxis: YAxisConfiguration = {
  label: {
    position: 'outer-middle',
    text: ''
  },
  min: 0, // helps with log scale
  // padding: 0, // helps with log scale
  tick: {
    format(value: number): string {
      return Number.isInteger(value) ? value.toString() : value.toFixed(4);
    }
  },
  type: 'linear'
};

type AxisFactoryEntry = Record<
  ChartType,
  {x: XAxisConfiguration; y: YAxisConfiguration}
>;

export function axisFactory(): AxisFactoryEntry {
  return {
    'by size': {
      x: <XAxisConfiguration>{
        label: {
          position: 'outer-left'
        },
        type: 'category'
      },
      y: yAxis
    },
    'by timestamp': {
      x: <XAxisConfiguration>{
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
  };
}

//----------------------------------------------------------------------------
// Pure Functions For Chart Data
//----------------------------------------------------------------------------
export function getAxisXLabel(
  {chartType}: FormConfiguration,
  {hasNodes}: HasNodesOptions
): string {
  return chartType === BY_TIMESTAMP
    ? 'timestamp'
    : hasNodes
    ? 'nodes'
    : 'payload size in bytes';
}

export function getAxisXTimeStampType({
  useTimeSeries
}: HasUseTimeSeriesOptions): XAxisType {
  return useTimeSeries ? 'timeseries' : 'category';
}

export function getAxisYLabel(
  {plotType, statName}: FormConfiguration,
  {statProperties}: HasStatPropertiesOptions
): string {
  if (!plotType) return '';
  const unit = statProperties[plotType].units;
  return [statName, unit].filter(i => i).join(' ');
}

export function getAxisYMin(
  {useLogScale}: HasLogScaleOptions,
  {columns}: HasColumnsOptions
): number {
  if (!useLogScale || columns.length === 0) return 0;

  let minY = Number.MAX_VALUE;
  for (const column of columns) {
    const [label, ...rest] = column;
    if (label !== 'x') {
      // Ignore zero values.
      const values = <number[]>(
        rest.filter(v => typeof v !== 'string').filter(v => v !== 0)
      );
      minY = Math.min(minY, ...values);
    }
  }
  return minY;
}

export function getAxisYType({useLogScale}: HasLogScaleOptions): YAxisType {
  if (useLogScale) return 'log';
  return 'linear';
}

export const getLegendTitle = (
  {chartType}: FormConfiguration,
  {hasNodes}: HasNodesOptions
): string =>
  chartType === BY_SIZE
    ? 'Timestamp'
    : hasNodes
    ? 'Node Count'
    : 'Payload Bytes';
