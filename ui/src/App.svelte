<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimestampSelection from './TimestampSelection.svelte';

  const BASE_URL = 'http://localhost:1919/';

  const CHART_TYPES = ['by timestamp', 'by size'];

  const SCENARIOS = {
    Discovery: 'disco',
    'Echo RTPS': 'echo_rtps',
    'Echo TCP': 'echo_tcp',
    'Fan RTPS': 'fan_rtps',
    'Fan TCP': 'fan_tcp',
    'Showtime Mixed': 'showtime_mixed'
  };

  const DEFAULT_RECENT_COUNT = 5;
  const MEAN_PLUS = 'Mean + Standard Deviation';
  const MEDIAN_PLUS = 'Median + Median Deviation';
  const MDTD = 'Max Discovery Time Delta';

  const PLOT_TYPES = [
    'Latency',
    'Jitter',
    'Round Trip Latency',
    'Round Trip Jitter'
  ];

  const SERVER_COUNTS = [4, 16];

  const STAT_NAMES = {
    Minimum: 'min',
    Maximum: 'max',
    [MEAN_PLUS]: 'mean',
    [MEDIAN_PLUS]: 'median'
  };

  const axisBySize = {
    x: {
      label: {
        position: 'outer-left'
      },
      type: 'category'
    },
    y: {
      label: {
        position: 'outer-middle',
        text: ''
      },
      min: 0, // helps with log scale
      padding: 0 // helps with log scale
    }
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
    y: {
      label: {
        position: 'outer-middle',
        text: ''
      },
      min: 0, // helps with log scale
      padding: 0 // helps with log scale
    }
  };

  $: axisByTimestamp.x.type = useTimeSeries ? 'timeseries' : 'category';
  $: axisByTimestamp.x.tick.fit = useTimeSeries;

  let data = {columns: [], x: 'x'};

  let chartType = 'by size';
  let scenarioDisplayName = 'Echo RTPS';
  let selectingTimestamps = false;
  let serverCount = 16;
  let statDisplayName = MEAN_PLUS;
  let statistics;
  let plotType = 'Latency';
  let timestamps = [];
  let useLogScale = false;
  let useTimeSeries = false;

  onMount(loadData);

  $: axis = chartType === 'by timestamp' ? axisByTimestamp : axisBySize;
  $: axis.x.label.text =
    chartType === 'by timestamp'
      ? 'timestamp'
      : scenario === 'disco' || scenario.startsWith('showtime_')
      ? 'nodes'
      : 'payload size';
  $: axis.y.type = useLogScale ? 'log' : 'linear';
  $: scenario = SCENARIOS[scenarioDisplayName];
  $: statName = STAT_NAMES[statDisplayName];
  $: plotTypes =
    scenario === 'showtime_mixed'
      ? PLOT_TYPES.filter(st => !st.startsWith('Round Trip'))
      : PLOT_TYPES;
  $: title = `${scenarioDisplayName} - ${plotType} - ${statDisplayName}`;

  $: if (statistics) {
    data.columns = [];

    if (chartType === 'by timestamp') {
      getChartDataByTimestamp(scenario, serverCount, plotType, statName);
    } else {
      getChartDataBySize(scenario, serverCount, plotType, statName);
    }

    if (axis) axis.y.label.text = statDisplayName;
  }

  function scenarioChanged(event) {
    const {value} = event.target;
    if (value === 'Discovery') {
      statDisplayName = MDTD;
      statName = 'maxDiscoveryTimeDelta';
    } else if (statDisplayName === MDTD) {
      statDisplayName = MEAN_PLUS;
      statName = 'mean';
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

        const key = scenario.startsWith('fan')
          ? size + '_' + serverCount
          : size;
        let obj = statistics[timestamp.full][scenario];
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
    const isFan = scenario.startsWith('fan_');

    const xValues = timestamps.map(timestamp => timestamp.dateTime);
    const arr = ['x', ...xValues];
    const columns = [arr];

    const dataNames = getDataNames();

    for (const dataName of dataNames) {
      const column = [dataName];

      for (const timestamp of timestamps) {
        if (!timestamp.selected) continue;

        let value = 0;

        const dataForName = statistics[timestamp.full][scenario];
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
    const isFan = scenario.startsWith('fan_');

    const dataNames = new Set();
    const timestamps = Object.keys(statistics);
    for (const timestamp of timestamps) {
      const obj = statistics[timestamp][scenario];
      if (obj) {
        for (const dataName of Object.keys(obj)) {
          if (!isFan || dataName.endsWith('_' + serverCount)) {
            dataNames.add(isFan ? dataName.split('_')[0] : dataName);
          }
        }
      }
    }
    return [...dataNames].sort((n1, n2) => Number(n1) - Number(n2));
  }

  function getErrorCount(timestamp) {
    let errorCount = 0;

    const timestampData = statistics[timestamp];
    for (const scenario of Object.keys(timestampData)) {
      const scenarioData = timestampData[scenario];
      for (const size of Object.keys(scenarioData)) {
        const sizeData = scenarioData[size];
        errorCount += sizeData.Errors || 0;
      }
    }

    return errorCount;
  }

  function getSizes() {
    const isFan = scenario.startsWith('fan_');

    const sizes = new Set();
    const timestamps = Object.keys(statistics);
    for (const timestamp of timestamps) {
      const scenarioObj = statistics[timestamp][scenario];
      if (scenarioObj) {
        const scenarioSizes = Object.keys(scenarioObj);
        for (const scenarioSize of scenarioSizes) {
          if (!isFan || scenarioSize.endsWith('_' + serverCount)) {
            sizes.add(isFan ? scenarioSize.split('_')[0] : scenarioSize);
          }
        }
      }
    }

    return [...sizes].sort((s1, s2) => Number(s1) - Number(s2));
  }

  function getTimestamps() {
    if (!statistics) return [];

    const keys = Object.keys(statistics);
    const firstSelectedIndex = keys.length - DEFAULT_RECENT_COUNT;

    const timestamps = keys.map((full, index) => {
      const [dateTime, hash] = full.split('_');
      const [date, timePlus] = dateTime.split('T');
      const [time] = timePlus.split('+');
      return {
        date,
        dateTime: date + ' ' + time,
        errorCount: getErrorCount(full),
        full,
        hash,
        selected: index >= firstSelectedIndex,
        time
      };
    });

    return timestamps;
  }

  async function loadData() {
    try {
      const res = await fetch(BASE_URL + 'data');
      if (res.ok) {
        statistics = await res.json();
        timestamps = getTimestamps();
        console.log('App.svelte loadData: statistics =', statistics);
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
        options={Object.keys(SCENARIOS)}
        bind:value={scenarioDisplayName} />
      {#if scenario.startsWith('fan_')}
        <Select
          label="# of Servers"
          options={SERVER_COUNTS}
          bind:value={serverCount} />
      {/if}

      <Select label="Chart Type" options={CHART_TYPES} bind:value={chartType} />
      {#if chartType === 'by timestamp'}
        <label>Space X values by time <input type="checkbox" bind:checked={useTimeSeries} />
        </label>
      {/if}
      <label>Log Scale for Y Axis <input type="checkbox" bind:checked={useLogScale} />
      </label>
    </div>
    <div>
      {#if scenario !== 'disco'}
        <Select label="Plot" options={plotTypes} bind:value={plotType} />

        <Select
          label="Statistic"
          options={Object.keys(STAT_NAMES)}
          bind:value={statDisplayName} />
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
    <LineChart {axis} bind:data {title} />
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
