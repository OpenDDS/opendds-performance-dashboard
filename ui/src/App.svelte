<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimestampSelection from './TimestampSelection.svelte';
  import {collectedData, getStatProperties, getTimestamps} from './data-loader';
  import {
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE,
    MDTD,
    chartDataFactory,
    deriveClassNameFromTimestampKey,
    deriveSelectOptionsFromData
  } from './data-extractor';
  import {objectToQuery, queryToObject} from './url-builder';

  const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';

  const DEFAULT_CHART_TYPE = BY_SIZE;
  const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
  const DEFAULT_RECENT_COUNT = 5;
  const DEFAULT_SCENARIO = 'fan_rtps';
  const DEFAULT_STAT_NAME = 'mean';

  const debug = true;
  function Dlog(...args) {
    if (debug) console.debug(...args);
  }

  const initialData = queryToObject(window.location.search);

  /*
  const statToUnit = {
    madev: 'seconds',
    max: 'seconds',
    mean: 'seconds',
    median: 'seconds',
    min: 'seconds',
    overflow: 'count',
    stdev: 'seconds'
  };
  */
  const yAxis = {
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

  const AXIS_CONFIGURATION = {
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
  };

  let benchmarks = {};
  let chartData = {columns: [], x: 'x'};
  const errors = new Map();

  let allPlotTypes = [];
  let chartType = DEFAULT_CHART_TYPE;

  let scenarios = [];
  let scenario = DEFAULT_SCENARIO;
  let selectingTimestamps = false;
  let serverCount = 16;

  let serverCountMap = {scenario: []};
  let serverCounts = [];

  let statName = DEFAULT_STAT_NAME;
  let statNames = [];
  let statProperties;
  let plotType = DEFAULT_PLOT_TYPE;
  let plotTypes = [];

  let selectedTimestamps = [];
  let timestamps = [];

  let useLogScale = false;
  let useTimeSeries = false;

  onMount(initialize);

  $: isReady = $collectedData && statProperties;

  // Axis Configuration
  $: AXIS_CONFIGURATION[BY_TIMESTAMP].x.type = useTimeSeries
    ? 'timeseries'
    : 'category';
  $: AXIS_CONFIGURATION[BY_TIMESTAMP].x.tick.fit = useTimeSeries;
  $: axis = AXIS_CONFIGURATION[chartType];

  $: axis.y.type = useLogScale ? 'log' : 'linear';
  $: axis.y.min = getMinY(chartData);

  // X and Y Label
  $: if (isReady && axis) {
    axis.y.label.text = getYLabel({statProperties, plotType, statName});
    axis.x.label.text = getXLabel({chartType, hasNodes});
  }

  // Whether The current benchmark should display nodes
  $: hasNodes = scenario === 'disco' || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(scenario, chartType);

  $: plotTypes = scenario.startsWith('showtime_')
    ? allPlotTypes.filter(st => !st.startsWith('Round Trip'))
    : scenario === 'disco'
    ? allPlotTypes.filter(st => !st.includes('Latency'))
    : allPlotTypes;

  // If the current value of plotType is not in the list of
  // supported plot types, change it to the first supported plot type.
  $: if (plotTypes.length && !plotTypes.includes(plotType))
    plotType = plotTypes[0];

  $: isFan = scenario.startsWith('fan_');
  $: title = `${scenario} - ${plotType} - ${statName}`;

  $: selectedTimestamps = timestamps.filter(ts => ts.selected);
  $: {
    loadBenchmarks(selectedTimestamps);
  }

  $: {
    console.debug('Timestamps Changed', timestamps);
  }

  $: {
    const tsKeys = new Set(selectedTimestamps.map(t => t.key));
    benchmarks = Object.entries($collectedData).reduce(
      (acc, [key, dataSet]) => {
        if (tsKeys.has(key)) {
          acc[key] = dataSet;
        }
        return acc;
      },
      {}
    );
  }

  $: {
    const query = objectToQuery({
      scenario,
      serverCount,
      plotType,
      statName,
      chartType,
      useTimeSeries,
      useLogScale,
      timestamps: selectedTimestamps.map(i => i.key)
    });
    window.history.replaceState('', '', query);
  }

  $: if (isReady) {
    const opts = {
      selectedTimestamps,
      scenario,
      serverCount,
      plotType,
      statName,
      isFan
    };
    const factory = chartDataFactory(chartType);
    factory(benchmarks, opts).then(results => {
      if (!results) return;
      chartData = results;
    });
  }

  $: if (isReady) {
    serverCounts = serverCountMap[scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(serverCount) === -1) {
      serverCount === serverCounts[0];
    }
  }

  function applyInitialData(timestamps) {
    const required = [
      'scenario',
      'plotType',
      'statName',
      'chartType',
      'useTimeSeries',
      'useLogScale'
    ];
    const keys = Object.keys(initialData).filter(key => required.includes(key));
    if (!keys.length) return;

    const missing = required.filter(i => {
      return !keys.includes(i);
    });

    if (missing.length) {
      alert(
        `There appears to be required parameters missing from the link: ${missing.toString()}`
      );
    }

    scenario = initialData.scenario;
    serverCount = initialData.serverCount;
    plotType = initialData.plotType;
    statName = initialData.statName;
    chartType = initialData.chartType;
    useTimeSeries = initialData.useTimeSeries;
    useLogScale = initialData.useLogScale;

    // Handle Optional Parameters
    if (initialData.serverCount) {
      serverCount = initialData.serverCount;
    }
  }

  function getTimeKey(timestamp) {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function getYLabel({statProperties, plotType, statName}) {
    if (!plotType) return '';
    const unit = statProperties[plotType].units;
    return [statName, unit].filter(i => i).join(' ');
  }

  function getXLabel({chartType, hasNodes}) {
    return chartType === BY_TIMESTAMP
      ? 'timestamp'
      : hasNodes
      ? 'nodes'
      : 'payload size in bytes';
  }

  const getLegendTitle = (scenario, chartType) =>
    chartType === BY_SIZE
      ? 'Timestamp'
      : hasNodes
      ? 'Node Count'
      : 'Payload Bytes';

  function getMinY() {
    const {columns} = chartData;
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

  function setSelectOptions(benchmarks) {
    const options = deriveSelectOptionsFromData(benchmarks);
    scenarios = options.scenarios;
    allPlotTypes = options.allPlotTypes;
    statNames = options.statNames;
    serverCountMap = options.serverCountMap;
  }

  async function loadBenchmarks(timestamps = []) {
    const results = await collectedData.loadBenchmarks(
      timestamps.map(t => t.key)
    );
    setSelectOptions(results);
    setErrors(results);
  }

  async function initialize() {
    try {
      statProperties = await getStatProperties();
      console.log('Initializing...');
      timestamps = await loadTimestamps(
        DEFAULT_RECENT_COUNT,
        initialData.timestamps
      );
      applyInitialData();
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  }

  function mapTimestampsToViewModel(timestamps, start, initiallySelected) {
    const useStart =
      !Array.isArray(initiallySelected) || initiallySelected.length === 0;

    function isSelected(key, index) {
      if (useStart) return index >= start;
      return initiallySelected.indexOf(key) !== -1;
    }

    return timestamps.map(
      ({key, commit, date: dateTime, hash, errors: errorCount}, index) => {
        const [date, timePlus] = dateTime.split('T');
        const [time] = timePlus.split('+');
        const selected = isSelected(key, index);

        return {
          key,
          date,
          time,
          dateTime: date + ' ' + time,
          full: key,
          errorCount,
          gitCommit: commit,
          hash,
          selected,
          url: GITHUB_COMMIT_URL + commit
        };
      }
    );
  }

  async function loadTimestamps(defaultCount = 1, initiallySelected = []) {
    const timestamps = await getTimestamps();
    const start = timestamps.length - defaultCount;
    return mapTimestampsToViewModel(timestamps, start, initiallySelected);
  }

  function scenarioChanged(event) {
    scenario = event.target.value;
    if (statName === MDTD) statName = DEFAULT_STAT_NAME;
  }

  function setErrors(collectedData) {
    errors.clear();
    for (const [timestamp, timeData] of Object.entries(collectedData)) {
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

  function styleErrors() {
    const selectedDateTimes = selectedTimestamps.map(ts => ts.key);

    const selectedSet = new Set(selectedDateTimes);

    const bySize = chartType === BY_SIZE;

    const xLabels = chartData.columns[0].slice(1);

    const active = [...errors.values()].filter(error => {
      const {scenario, key} = error;
      return scenario === scenario && selectedSet.has(key);
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
        if (!circle) {
          Dlog('circle not found', label, xLabels);
          return;
        }
        circle.style.stroke = 'red';
        circle.style.strokeWidth = 4;
      } else {
        // This should never happen.
        Dlog('circle group not found');
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
          console.log(
            'App.svelte x: timestamp =',
            timestamp,
            ', index =',
            index
          );
          const g = document.querySelector('.c3-circles-' + timestamp);
          const circle = g.querySelector('.c3-circle-' + (index - 1));
          circle.style.stroke = 'orange';
          circle.style.strokeWidth = 4;
        }
      });
    }
  }

  function styleSpecialPoints() {
    styleErrors();
    styleMissingPoints();
  }
</script>

<main>
  <header class="row">
    <h1 class="title">OpenDDS Bench Scoreboard</h1>

    <div class="right">
      <button
        type="button"
        on:click={() => (selectingTimestamps = !selectingTimestamps)}>
        {selectingTimestamps ? 'Close Timestamp Picker' : 'Select Timestamps'}
      </button>
    </div>
  </header>
  <div class="row">
    <form>
      <div class="row">
        <Select
          label="Scenario"
          on:blur={scenarioChanged}
          on:change={scenarioChanged}
          options={scenarios}
          value={scenario} />

        <Select
          label="Chart Type"
          options={CHART_TYPES}
          bind:value={chartType} />

        {#if plotType}
          <Select label="Plot" options={plotTypes} bind:value={plotType} />
        {/if}

        <Select label="Statistic" options={statNames} bind:value={statName} />

        {#if isFan}
          <Select
            label="# of Servers"
            options={serverCounts}
            bind:value={serverCount} />
        {/if}
      </div>
      <div>
        <label>
          <input type="checkbox" bind:checked={useLogScale} /> Log Scale for Y Axis
        </label>
        {#if chartType === BY_TIMESTAMP}
          <label><input type="checkbox" bind:checked={useTimeSeries} /> Space X values
            by time
          </label>
        {/if}
      </div>
    </form>
  </div>

  {#if selectingTimestamps}
    <TimestampSelection
      {timestamps}
      on:change={({detail}) => {
        console.log('Parent Changes', detail);
        timestamps = detail;
      }}
      on:close={() => (selectingTimestamps = false)} />
  {:else}
    <LineChart
      {axis}
      data={chartData}
      {legendTitle}
      {title}
      on:rendered={styleSpecialPoints} />
  {/if}
</main>

<style>
  main {
    max-width: 1000px;
    margin: auto;
  }

  header {
    align-items: center;
  }
  header .right {
    flex: 0;
    width: max-content;
  }

  form {
    display: flex;
    flex-direction: column;
    min-height: 10rem;
  }

  form .row {
    display: flex;
    flex-wrap: wrap;
  }
  form > div {
    margin-right: 2rem;
    margin-bottom: 1rem;
  }

  .row {
    display: flex;
  }
  .row > * {
    flex: 1;
  }
</style>
