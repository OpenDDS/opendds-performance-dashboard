<script lang="ts">
  import {errorStore} from '../utility/data-loader';
  import LineChart from './LineChart.svelte';

  import {
    chartDataFactory,
    classNameFromBenchmarkKey,
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE
  } from './chart-data-extractor';

  import type {ChartFactoryData} from './chart-data-extractor';

  import {
    axisFactory,
    getAxisYLabel,
    getAxisXLabel,
    getAxisYMin,
    getAxisYType,
    getLegendTitle,
    getAxisXTimeStampType,
    DEFAULT_CHART_HEIGHT
  } from './chart-layout-helpers';
  import type {
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    Scenario,
    StatProperties,
    TimestampViewModel
  } from '../types';
  import type {Primitive} from 'c3';

  type ErrorEntry = {
    key: BenchmarkIdentifier;
    scenario: Scenario;
    dateTime: string;
    size: string;
  };

  export let form: FormConfiguration;

  export let benchmarks: Benchmarks = {};
  export let timestamps: TimestampViewModel[] = [];
  export let statProperties: StatProperties;

  let errors = new Map<BenchmarkIdentifier, ErrorEntry>();
  let chartData: ChartFactoryData = {columns: [], x: 'x', names: {}};

  $: scenario = form.scenario;
  $: chartType = form.chartType;

  $: isReady = benchmarks && statProperties && form && true;

  $: hasNodes = scenario === 'disco' || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(form, {hasNodes});
  $: title = [form.scenario, form.plotType, form.statName].join(' \uFF5C ');

  let axisConfigurations = axisFactory();

  // Axis Configuration
  $: axisConfigurations[BY_TIMESTAMP].x.type = getAxisXTimeStampType(form);
  $: axisConfigurations[BY_TIMESTAMP].x.tick.fit = form.useTimeSeries;
  $: axis = axisConfigurations[chartType];

  // X and Y Label
  $: if (chartData && axis && isReady) {
    axis.y.type = getAxisYType(form);
    axis.y.min = getAxisYMin(form, chartData);
    if (typeof axis.y.label !== 'string') {
      axis.y.label.text = getAxisYLabel(form, {statProperties});
    }
    if (typeof axis.x.label !== 'string') {
      axis.x.label.text = getAxisXLabel(form, {hasNodes});
    }
  }

  $: if (isReady) {
    const selected = timestamps.filter(({key}) => {
      return form.selectedTimestamps.indexOf(key) !== -1;
    });

    const factory = chartDataFactory(chartType);
    factory(benchmarks, selected, form).then(onLoaded).catch(onError);
  }

  $: {
    deriveDataPointErrors(benchmarks);
  }

  function onLoaded(results: ChartFactoryData) {
    if (!results) return;
    chartData = results;
  }

  function onError(error: Error) {
    errorStore.onError(error);
  }

  function getTimeKey(timestamp: string): string {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function deriveDataPointErrors(benchmarks: Benchmarks) {
    errors.clear();
    for (const [timestamp, timeData] of Object.entries(benchmarks)) {
      const dateTime = getTimeKey(timestamp);
      for (const [scenario, scenarioData] of Object.entries(timeData)) {
        for (const [size, sizeData] of Object.entries(scenarioData)) {
          if (sizeData.Errors) {
            const id = [scenario, timestamp].join('|');
            errors.set(id, {
              key: timestamp,
              scenario,
              dateTime,
              size
            });
          }
        }
      }
    }
  }

  function styleDataPointErrors() {
    if (
      !Array.isArray(chartData.columns) ||
      !Array.isArray(chartData.columns[0])
    )
      return;

    const selectedSet = new Set(form.selectedTimestamps);

    const bySize = chartType === BY_SIZE;

    const xLabels = chartData.columns[0].slice(1);

    const active = [...errors.values()].filter(error => {
      const {scenario: es, key} = error;
      return es === scenario && selectedSet.has(key);
    });

    // SVG circle elements for points can be found
    // with this series of CSS selectors:
    // .open-dds-chart
    // svg
    // .c3-chart
    // .c3-chart-lines
    // .c3-chart-line
    // .c3-circles-{className}
    // circle
    // where the circle elements are in order by x label.
    for (const error of active) {
      const {key, size, dateTime} = error;
      const timestampAsClassName = classNameFromBenchmarkKey(key);

      const trimmedSize = size.split('_')[0];
      const formattedDateTime = dateTime.replace('_', ' ');
      const className = bySize ? timestampAsClassName : trimmedSize;
      const circleGroup = document.querySelector('.c3-circles-' + className);

      if (circleGroup) {
        const label = bySize ? trimmedSize : formattedDateTime;
        const index = xLabels.indexOf(label);
        const circle = <SVGElement>circleGroup.children.item(index);
        if (circle) {
          circle.style.stroke = 'red';
          circle.style.strokeWidth = '4';
        }
      } else {
        // This should never happen.
        console.error('circle group not found');
      }
    }
  }

  function styleMissingPointIfFound(
    timestamp: string,
    value: Primitive,
    index: number
  ): void {
    if (value !== MISSING_VALUE) return;
    const g = document.querySelector('.c3-circles-' + timestamp);
    if (!g) return;

    const circle = <SVGElement>g.querySelector('.c3-circle-' + (index - 1));
    if (!circle) return;

    circle.style.stroke = 'orange';
    circle.style.strokeWidth = '4';
  }

  function styleMissingPoints() {
    // console.log('App.svelte styleMissingPoints: data =', data);
    const {columns} = chartData;

    for (const column of columns) {
      const [timestamp] = column;
      for (let index = 0; index < column.length; index++) {
        const value = column[index];
        styleMissingPointIfFound(timestamp, value, index);
      }
    }
  }

  function styleSpecialPoints() {
    styleDataPointErrors();
    styleMissingPoints();
  }
</script>

<h2>{title}</h2>

<div class="panel container" style={`min-height: ${DEFAULT_CHART_HEIGHT}px`}>
  <LineChart
    {axis}
    data={chartData}
    height={DEFAULT_CHART_HEIGHT}
    {legendTitle}
    on:rendered={styleSpecialPoints}
  />
  <slot name="accessory" />
</div>

<style>
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    text-align: center;
    min-height: 1.5em;
  }
</style>
