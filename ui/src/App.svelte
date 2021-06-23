<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimestampSelection from './TimestampSelection.svelte';
  import {collectedData, getTestList} from './DataLoader';
  import {chartDataFactory} from './DataExtractor';

  const BY_SIZE = 'by size';
  const BY_TIMESTAMP = 'by timestamp';

  const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];

  const DATA_URL =
    location.hostname === 'localhost'
      ? 'http://localhost:1919/data'
      : //: 'http://scoreboard.ociweb.com/bench2/scrape_output.json';
        'scrape_output.json';

  const STAT_PROPERTIES_URL =
    location.hostname === 'localhost'
      ? 'http://localhost:1919/stat-properties'
      : //: 'http://scoreboard.ociweb.com/bench2/stat_properties.json';
        'stat_properties.json';

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';

  const DEFAULT_CHART_TYPE = BY_SIZE;
  const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
  const DEFAULT_RECENT_COUNT = 5;
  const DEFAULT_SCENARIO = 'fan_rtps';
  const DEFAULT_STAT_NAME = 'mean';
  const MDTD = 'Max Discovery Time Delta';

  // This is a value that would never occur in a real run
  // and is very close to zero.
  const MISSING_VALUE = -0.0000001;

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
  const errors = new Set();

  let allPlotTypes = [];
  let chartType = DEFAULT_CHART_TYPE;

  let scenarios = [];
  let scenario = DEFAULT_SCENARIO;
  let selectingTimestamps = false;
  let serverCount = 16;
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

  $: axis = chartType === BY_TIMESTAMP ? axisByTimestamp : axisBySize;
  $: axis.x.label.text =
    chartType === BY_TIMESTAMP
      ? 'timestamp'
      : hasNodes
      ? 'nodes'
      : 'payload size in bytes';
  $: axis.y.type = useLogScale ? 'log' : 'linear';
  $: axisByTimestamp.x.type = useTimeSeries ? 'timeseries' : 'category';
  $: axisByTimestamp.x.tick.fit = useTimeSeries;
  $: axis.y.min = getMinY(data);
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

  $: if ($collectedData && statProperties) {
    const selectedTimestamps = timestamps.filter(ts => ts.selected);
    const opts = {
      selectedTimestamps,
      scenario,
      serverCount,
      plotType,
      statName,
      isFan
    };

    const factory = chartDataFactory(chartType);
    factory($collectedData, opts).then(results => {
      console.log({results});
      if (!results) return;
      data = results;
    });
  }

  $: if ($collectedData && statProperties) {
    if (axis) axis.y.label.text = getYLabel(statProperties, plotType, statName);
    if (isFan && !serverCounts.length) getServerCounts($collectedData);
  }

  function findErrors() {
    errors.clear();

    for (const [timestamp, timeData] of Object.entries($collectedData)) {
      const ts = getTimeKey(timestamp);
      for (const [scenario, scenarioData] of Object.entries(timeData)) {
        for (const [size, sizeData] of Object.entries(scenarioData)) {
          if (sizeData.Errors) {
            const key = ts + '|' + scenario + '|' + size;
            errors.add(key);
          }
        }
      }
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

  async function getChartDataBySize(
    collectedData,
    {selectedTimestamps, scenario, serverCount, plotType, statName, isFan}
  ) {
    if (!scenario || !statName || !plotType) return;

    const sizes = getSizes(collectedData, scenario, isFan, serverCount);
    const arr = ['x', ...sizes];
    const columns = [arr];

    for (const timestamp of selectedTimestamps) {
      const column = [dateTimeToClassName(timestamp.dateTime)];
      for (const size of sizes) {
        let value = MISSING_VALUE;

        const key = isFan ? size + '_' + serverCount : size;
        let obj = collectedData[timestamp.full][scenario];
        if (obj) {
          obj = obj[key];
          if (obj) {
            const stats = obj[plotType];
            if (stats) value = stats[statName];
          }
        }

        column.push(value);
      }
      columns.push(column);
    }

    delete data.xFormat;
    data = {...data, columns};
  }

  async function getChartDataByTimestamp(
    collectedData,
    {selectedTimestamps, scenario, serverCount, plotType, statName, isFan}
  ) {
    if (!scenario || !statName || !plotType) return;
    // Load Data For Selected TimeStamps

    const xValues = selectedTimestamps.map(timestamp => timestamp.dateTime);
    const arr = ['x', ...xValues];
    const columns = [arr];

    const dataNames = getDataNames(collectedData, isFan);

    for (const dataName of dataNames) {
      const column = [dataName];

      for (const timestamp of selectedTimestamps) {
        let value = 0;

        const dataForName = collectedData[timestamp.full][scenario];
        if (dataForName) {
          const obj =
            dataForName[isFan ? dataName + '_' + serverCount : dataName];
          if (obj) {
            const stats = obj[plotType];
            if (stats) value = stats[statName];
          }
        }

        column.push(value);
      }

      columns.push(column);
    }

    const xFormat = '%Y-%m-%d %H:%M:%S'; // data format
    data = {...data, columns, xFormat};
  }

  // C3 uses the first value in the data columns arrays as CSS class names.
  // In this application, those values are date/time strings.
  // This function is needed because it is not valid
  // to have spaces or colons in CSS class names.
  function dateTimeToClassName(text) {
    return text.replaceAll(' ', '_').replaceAll(':', '-');
  }

  function classNameToDateTime(text) {
    const [date, time] = text.split('_');
    const newTime = time.replaceAll('-', ':');
    return date + ' ' + newTime;
  }

  function getDataNames(collectedData, isFan) {
    const dataNames = new Set();
    for (const timestampObj of Object.values(collectedData)) {
      const scenarioObj = timestampObj[scenario];
      if (scenarioObj) {
        for (const dataName of Object.keys(scenarioObj)) {
          if (!isFan || dataName.endsWith('_' + serverCount)) {
            dataNames.add(isFan ? dataName.split('_')[0] : dataName);
          }
        }
      }
    }
    return [...dataNames].sort((n1, n2) => Number(n1) - Number(n2));
  }

  const getLegendTitle = (scenario, chartType) =>
    chartType === BY_SIZE
      ? 'Timestamp'
      : hasNodes
      ? 'Node Count'
      : 'Payload Bytes';

  function getServerCounts(collectedData) {
    if (!isFan) return [];

    const uniqueServerCounts = new Set();
    for (const timestampObj of Object.values(collectedData)) {
      const scenarioObj = timestampObj[scenario];
      if (scenarioObj) {
        for (const scenarioSize of Object.keys(scenarioObj)) {
          uniqueServerCounts.add(scenarioSize.split('_')[1]);
        }
      }
    }

    serverCounts = [...uniqueServerCounts].sort(
      (n1, n2) => Number(n1) - Number(n2)
    );
    // Choose last one by default.
    serverCount = serverCounts[serverCounts.length - 1];
  }

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

  function getSizes(collectedData, scenario, isFan, serverCount) {
    const sizes = new Set();

    for (const timestampObj of Object.values(collectedData)) {
      const scenarioObj = timestampObj[scenario];
      if (scenarioObj) {
        for (const scenarioSize of Object.keys(scenarioObj)) {
          if (!isFan || scenarioSize.endsWith('_' + serverCount)) {
            sizes.add(isFan ? scenarioSize.split('_')[0] : scenarioSize);
          }
        }
      }
    }

    return [...sizes].sort((n1, n2) => Number(n1) - Number(n2));
  }

  function getTimestampData(timestamp) {
    const [dateTime, gitCommit, hash] = timestamp.split('_');
    const [date, timePlus] = dateTime.split('T');
    const [time] = timePlus.split('+');
    return {
      date,
      dateTime: date + ' ' + time,
      errorCount: 0,
      full: timestamp,
      gitCommit,
      hash,
      time,
      url: GITHUB_COMMIT_URL + gitCommit
    };
  }

  function getUniqueValues() {
    const uniqueScenarios = new Set();
    const uniquePlotTypes = new Set();
    const uniqueStatNames = new Set();

    const timestampEntries = Object.entries($collectedData);

    const firstSelectedIndex = timestampEntries.length - DEFAULT_RECENT_COUNT;

    timestampEntries.forEach((timestampEntry, index) => {
      const [timestamp, timestampObj] = timestampEntry;
      const timestampData = getTimestampData(timestamp);
      timestampData.selected = index >= firstSelectedIndex;
      timestamps.push(timestampData);

      for (const [scenario, scenarioObj] of Object.entries(timestampObj)) {
        uniqueScenarios.add(scenario);

        for (const sizeObj of Object.values(scenarioObj)) {
          timestampData.errorCount += sizeObj.Errors;

          for (const [plotType, plotTypeObj] of Object.entries(sizeObj)) {
            uniquePlotTypes.add(plotType);

            for (const statName of Object.keys(plotTypeObj)) {
              uniqueStatNames.add(statName);
            }
          }
        }
      }
    });

    scenarios = [...uniqueScenarios].sort();

    console.log(uniquePlotTypes);

    uniquePlotTypes.delete('Errors');
    uniquePlotTypes.delete(MDTD);
    allPlotTypes = [...uniquePlotTypes].sort();
    statNames = [...uniqueStatNames].sort();
  }

  async function loadData() {
    try {
      statProperties = await getTestList();
      await collectedData.loadAll();
      getUniqueValues();
      findErrors();
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  }

  function scenarioChanged(event) {
    scenario = event.target.value;
    if (statName === MDTD) statName = DEFAULT_STAT_NAME;
  }

  function styleErrors() {
    const selectedTimestamps = timestamps.filter(
      timestamp => timestamp.selected
    );
    const selectedDateTimes = selectedTimestamps.map(ts =>
      dateTimeToClassName(ts.dateTime)
    );
    const selectedSet = new Set(selectedDateTimes);

    const bySize = chartType === 'by size';

    const xLabels = data.columns[0].slice(1);

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
    for (const error of errors) {
      const [timestamp, errorScenario, size] = error.split('|');
      const timestampAsClassName = dateTimeToClassName(timestamp);
      if (selectedSet.has(timestampAsClassName) && errorScenario === scenario) {
        const trimmedSize = size.split('_')[0];
        const className = bySize ? timestampAsClassName : trimmedSize;
        const circleGroup = document.querySelector('.c3-circles-' + className);
        if (circleGroup) {
          const label = bySize ? trimmedSize : classNameToDateTime(timestamp);
          const index = xLabels.indexOf(label);
          const circle = circleGroup.children.item(index);
          circle.style.stroke = 'red';
          circle.style.strokeWidth = 4;
        } else {
          // This should never happen.
          console.error('circle group not found');
        }
      }
    }
  }

  function styleMissingPoints() {
    console.log('App.svelte styleMissingPoints: data =', data);

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

      <Select label="Chart Type" options={CHART_TYPES} bind:value={chartType} />
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
    <div>
      <button type="button" on:click={() => (selectingTimestamps = true)}>
        Select Timestamps
      </button>
    </div>
  </form>

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
  form {
    display: flex;
  }

  form > div {
    margin-right: 2rem;
  }
</style>
