<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimestampSelection from './TimestampSelection.svelte';

  const BY_SIZE = 'by size';
  const BY_TIMESTAMP = 'by timestamp';

  const CHART_TYPES = [BY_TIMESTAMP, BY_SIZE];

  const DATA_URL =
    location.hostname === 'localhost'
      ? 'http://localhost:1919/data'
      : 'http://scoreboard.ociweb.com/bench2/scrape_output.json';

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';

  const DEFAULT_CHART_TYPE = BY_SIZE;
  const DEFAULT_PLOT_TYPE = 'Round Trip Latency';
  const DEFAULT_RECENT_COUNT = 5;
  const DEFAULT_SCENARIO = 'fan_rtps';
  const DEFAULT_STAT_NAME = 'mean';
  const MDTD = 'Max Discovery Time Delta';

  const statToUnit = {
    madev: 'seconds',
    max: 'seconds',
    mean: 'seconds',
    median: 'seconds',
    min: 'seconds',
    overflow: 'count',
    stdev: 'seconds'
  };

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

  let allPlotTypes = [];
  let chartType = DEFAULT_CHART_TYPE;
  let collectedData;
  let scenarios = [];
  let scenario = DEFAULT_SCENARIO;
  let selectingTimestamps = false;
  let serverCount = 16;
  let serverCounts = [];
  let statName = DEFAULT_STAT_NAME;
  let statNames = [];
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
    : allPlotTypes;
  $: isFan = scenario.startsWith('fan_');
  $: title =
    scenario === 'disco'
      ? `${scenario} - ${statName}`
      : `${scenario} - ${plotType} - ${statName}`;

  $: if (collectedData) {
    data.columns = [];

    if (chartType === BY_TIMESTAMP) {
      getChartDataByTimestamp(scenario, serverCount, plotType, statName);
    } else {
      getChartDataBySize(scenario, serverCount, plotType, statName);
    }

    if (axis) axis.y.label.text = getYLabel(statName);

    if (isFan && !serverCounts.length) getServerCounts();
  }

  function getYLabel(statName) {
    const unit = statToUnit[statName];
    return statName + (unit ? ' ' + unit : '');
  }

  function scenarioChanged(event) {
    scenario = event.target.value;
    if (scenario === 'disco') {
      statName = MDTD;
    } else if (statName === MDTD) {
      statName = DEFAULT_STAT_NAME;
    }
  }

  async function getChartDataBySize(scenario, serverCount, plotType, statName) {
    if (!scenario || !statName || !plotType) return;

    const isDiscovery = scenario === 'disco';
    const sizes = getSizes();
    const arr = ['x', ...sizes];
    const columns = [arr];

    data = {...data, columns};

    for (const timestamp of timestamps) {
      if (!timestamp.selected) continue;

      const column = [timestamp.dateTime];
      for (const size of sizes) {
        let value = 0;

        const key = isFan ? size + '_' + serverCount : size;
        let obj = collectedData[timestamp.full][scenario];
        if (obj) {
          obj = obj[key];
          if (obj) {
            if (isDiscovery) {
              value = obj[MDTD];
            } else {
              const stats = obj[plotType];
              if (stats) value = stats[statName];
            }
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
    scenario,
    serverCount,
    plotType,
    statName
  ) {
    if (!scenario || !statName || !plotType) return;

    const isDiscovery = scenario === 'disco';

    const xValues = timestamps
      .filter(ts => ts.selected)
      .map(timestamp => timestamp.dateTime);
    const arr = ['x', ...xValues];
    const columns = [arr];

    const dataNames = getDataNames();

    for (const dataName of dataNames) {
      const column = [dataName];

      for (const timestamp of timestamps) {
        if (!timestamp.selected) continue;

        let value = 0;

        const dataForName = collectedData[timestamp.full][scenario];
        if (dataForName) {
          const obj =
            dataForName[isFan ? dataName + '_' + serverCount : dataName];
          if (obj) {
            if (isDiscovery) {
              value = obj[MDTD];
            } else {
              const stats = obj[plotType];
              if (stats) value = stats[statName];
            }
          }
        }

        column.push(value);
      }

      columns.push(column);
    }

    const xFormat = '%Y-%m-%d %H:%M:%S'; // data format
    data = {...data, columns, xFormat};
  }

  function getDataNames() {
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

  function getServerCounts() {
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

  function getSizes() {
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

    const timestampEntries = Object.entries(collectedData);
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

    uniquePlotTypes.delete('Errors');
    uniquePlotTypes.delete(MDTD);
    allPlotTypes = [...uniquePlotTypes].sort();
    statNames = [...uniqueStatNames].sort();
  }

  async function loadData() {
    try {
      const res = await fetch(DATA_URL);
      if (res.ok) {
        collectedData = await res.json();
        //console.log('App.svelte loadData: collectedData =', collectedData);
        getUniqueValues(collectedData);
      } else {
        throw new Error(await res.text());
      }
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
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
      {#if scenario !== 'disco'}
        <Select label="Plot" options={plotTypes} bind:value={plotType} />
        <Select label="Statistic" options={statNames} bind:value={statName} />
      {/if}
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
    <LineChart {axis} bind:data {legendTitle} {title} />
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
