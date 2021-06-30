<script>
  import LineChart from './LineChart.svelte';
  import {
    deriveClassNameFromTimestampKey,
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE,
    chartDataFactory
  } from './chart-data-extractor';

  import {
    getAxisYLabel,
    getAxisXLabel,
    getAxisYMin,
    getYAxisType,
    getLegendTitle,
    getTimeStampXAxisType,
    axisFactory,
    DEFAULT_CHART_HEIGHT
  } from './chart-layout-helpers';

  export let form;

  export let benchmarks = {};
  export let timestamps = [];
  export let statProperties;

  let error = null;
  let errors = new Map();
  let chartData = {columns: [], x: 'x'};

  $: scenario = form.scenario;
  $: chartType = form.chartType;

  $: isReady = benchmarks && statProperties && form;

  $: hasNodes = scenario === 'disco' || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(form, {hasNodes});
  $: title = [form.scenario, form.plotType, form.statName].join(' \uFF5C ');

  let axisConfigurations = axisFactory();

  // Axis Configuration
  $: axisConfigurations[BY_TIMESTAMP].x.type = getTimeStampXAxisType(form);
  $: axisConfigurations[BY_TIMESTAMP].x.tick.fit = form.useTimeSeries;
  $: axis = axisConfigurations[chartType];

  // X and Y Label
  $: if (chartData && axis && isReady) {
    axis.y.type = getYAxisType(form);
    axis.y.min = getAxisYMin(form, chartData);
    axis.y.label.text = getAxisYLabel(form, {statProperties});
    axis.x.label.text = getAxisXLabel(form, {hasNodes});
  }

  $: if (isReady) {
    const selected = timestamps.filter(({key}) => {
      return form.selectedTimestamps.indexOf(key) !== -1;
    });
    const opts = {
      timestamps: selected,
      ...form
    };
    const factory = chartDataFactory(chartType);
    factory(benchmarks, opts).then(onLoaded).catch(onError);
  }

  $: {
    deriveDataPointErrors(benchmarks);
  }

  function onLoaded(results) {
    if (!results) return;
    chartData = results;
  }

  function onError(err) {
    error = err;
  }

  function getTimeKey(timestamp) {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function deriveDataPointErrors(benchmarks) {
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
      const timestampAsClassName = deriveClassNameFromTimestampKey(key);

      const trimmedSize = size.split('_')[0];
      const formattedDateTime = dateTime.replace('_', ' ');
      const className = bySize ? timestampAsClassName : trimmedSize;
      const circleGroup = document.querySelector('.c3-circles-' + className);

      if (circleGroup) {
        const label = bySize ? trimmedSize : formattedDateTime;
        const index = xLabels.indexOf(label);
        const circle = circleGroup.children.item(index);
        if (circle) {
          circle.style.stroke = 'red';
          circle.style.strokeWidth = 4;
        }
      } else {
        // This should never happen.
        console.error('circle group not found');
      }
    }
  }

  function styleMissingPoints() {
    // console.log('App.svelte styleMissingPoints: data =', data);
    const {columns} = chartData;
    for (const column of columns) {
      const [timestamp] = column;
      column.forEach((value, index) => {
        if (value === MISSING_VALUE) {
          // console.log(
          //   'App.svelte x: timestamp =',
          //   timestamp,
          //   ', index =',
          //   index
          // );
          const g = document.querySelector('.c3-circles-' + timestamp);
          const circle = g.querySelector('.c3-circle-' + (index - 1));
          circle.style.stroke = 'orange';
          circle.style.strokeWidth = 4;
        }
      });
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
    on:rendered={styleSpecialPoints} />

  {#if error}
    <div class="error">
      <b>There Was An Error</b>
      <div>{error.message}</div>
      <button role="button" on:click={() => (error = null)}>OK</button>
    </div>
  {/if}
</div>

<style>
  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;
    backdrop-filter: blur(6px);
  }
  .error > * {
    margin: 0.3rem 0;
  }
  .error button {
    margin-top: 1rem;
    min-width: 10rem;
  }

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
