<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimestampSelection from './TimestampSelection.svelte';
  import {collectedData, getStatProperties, getTimestamps} from './DataLoader';
  import {
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE,
    MDTD,
    chartDataFactory,
    deriveClassNameFromTimestampKey,
    deriveSelectOptionsFromData
  } from './DataExtractor';

  const debug = true;
  function Dlog(...args) {
    if (debug) console.debug(...args);
  }
  const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';

  const DEFAULT_CHART_TYPE = BY_SIZE;
  const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
  const DEFAULT_RECENT_COUNT = 5;
  const DEFAULT_SCENARIO = 'fan_rtps';
  const DEFAULT_STAT_NAME = 'mean';

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

  const axisBySize = {
    x: {
      label: {
        position: 'outer-left'
      },
      type: 'category'
    },
    y: yAxis
  };

  const axisByTimestamp = {
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
  };

  let data = {columns: [], x: 'x'};
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
  let timestamps = [];
  let useLogScale = false;
  let useTimeSeries = false;

  onMount(loadData);

  $: isReady = $collectedData && statProperties;

  $: axis = chartType === BY_TIMESTAMP ? axisByTimestamp : axisBySize;
  $: axis.x.label.text =
    chartType === BY_TIMESTAMP
      ? 'timestamp'
      : hasNodes
      ? 'nodes'
      : 'payload size in bytes';
  $: axis.y.type = useLogScale ? 'log' : 'linear';
  $: axis.y.min = getMinY(data);
  $: if (isReady) {
    if (axis) axis.y.label.text = getYLabel(statProperties, plotType, statName);
  }

  $: axisByTimestamp.x.type = useTimeSeries ? 'timeseries' : 'category';
  $: axisByTimestamp.x.tick.fit = useTimeSeries;

  $: hasNodes = scenario === 'disco' || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(scenario, chartType);

  $: plotTypes = scenario.startsWith('showtime_')
    ? allPlotTypes.filter(st => !st.startsWith('Round Trip'))
    : scenario === 'disco'
    ? allPlotTypes.filter(st => !st.includes('Latency'))
    : allPlotTypes;

  // If the current value of plotType is not in the list of
  // supported plot types, change it to the first supported plot type.
  $: if (!plotTypes.includes(plotType)) plotType = plotTypes[0];

  $: isFan = scenario.startsWith('fan_');
  $: title = `${scenario} - ${plotType} - ${statName}`;

  $: selectedTimestamps = timestamps.filter(ts => ts.selected);
  $: {
    loadBenchmarks(selectedTimestamps);
  }

  let benchmarks = {};
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
      data = results;
    });
  }

  $: if (isReady) {
    if (axis) axis.y.label.text = getYLabel(statProperties, plotType, statName);
    serverCounts = serverCountMap[scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(serverCount) === -1) {
      serverCount === serverCounts[0];
    }
  }

  function getTimeKey(timestamp) {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function getYLabel(statProperties, plotType, statName) {
    //const unit = statToUnit[statName];
    if (!plotType) return '';
    const unit = statProperties[plotType].units;
    return statName + (unit ? ' ' + unit : '');
  }

  const getLegendTitle = (scenario, chartType) =>
    chartType === BY_SIZE
      ? 'Timestamp'
      : hasNodes
      ? 'Node Count'
      : 'Payload Bytes';

  function getMinY() {
    const {columns} = data;
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

  function setSelectOptions(collectedData) {
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

  async function loadData() {
    try {
      statProperties = await getStatProperties();
      timestamps = await loadTimestamps();
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  }

  function mapTimestampsToViewModel(timestamps, start) {
    return timestamps.map(
      ({key, commit, date: dateTime, hash, errors: errorCount}, index) => {
        const [date, timePlus] = dateTime.split('T');
        const [time] = timePlus.split('+');

        return {
          key,
          date,
          time,
          dateTime: date + ' ' + time,
          full: key,
          errorCount,
          gitCommit: commit,
          hash,
          selected: index >= start,
          url: GITHUB_COMMIT_URL + commit
        };
      }
    );
  }

  async function loadTimestamps() {
    const timestamps = await getTimestamps();
    const start = timestamps.length - DEFAULT_RECENT_COUNT;
    return mapTimestampsToViewModel(timestamps, start);
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

    const xLabels = data.columns[0].slice(1);

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
        if (!circle) Dlog('circle not found', label, xLabels);
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

    const {columns} = data;
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
  <h1>OpenDDS Bench Scoreboard</h1>

  <div class="row">
    <form>
      <div>
        <Select
          label="Scenario"
          on:blur={scenarioChanged}
          on:change={scenarioChanged}
          options={scenarios}
          value={scenario} />
        {#if isFan}
          <Select
            label="# of Servers"
            options={serverCounts}
            bind:value={serverCount} />
        {/if}

        <Select
          label="Chart Type"
          options={CHART_TYPES}
          bind:value={chartType} />
        {#if chartType === BY_TIMESTAMP}
          <label>Space X values by time <input type="checkbox" bind:checked={useTimeSeries} />
          </label>
        {/if}
        <label>Log Scale for Y Axis <input type="checkbox" bind:checked={useLogScale} />
        </label>
      </div>
      <div>
        {#if plotType}
          <Select label="Plot" options={plotTypes} bind:value={plotType} />
        {/if}
        <Select label="Statistic" options={statNames} bind:value={statName} />
      </div>
    </form>

    <div>
      <button
        type="button"
        on:click={() => (selectingTimestamps = !selectingTimestamps)}>
        {selectingTimestamps ? 'Close Timestamp Picker' : 'Select Timestamps'}
      </button>
    </div>
  </div>

  {#if selectingTimestamps}
    <TimestampSelection
      bind:timestamps
      on:close={() => (selectingTimestamps = false)} />
  {:else}
    <LineChart
      {axis}
      bind:data
      {legendTitle}
      {title}
      on:rendered={styleSpecialPoints} />
  {/if}
</main>

<style>
  .row {
    display: flex;
  }
  .row > * {
    flex: 1;
  }

  form {
    display: flex;
  }

  form > div {
    margin-right: 2rem;
  }
</style>
