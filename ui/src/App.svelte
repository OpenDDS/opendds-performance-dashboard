<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';

  const BASE_URL = 'http://localhost:1919/';

  const CHART_TYPES = ['by timestamp', 'by size'];

  const DATA_SETS = {
    Discovery: 'disco',
    'Echo RTPS': 'echo_rtps',
    'Echo TCP': 'echo_tcp',
    'Fan RTPS': 'fan_rtps',
    'Fan TCP': 'fan_tcp',
    'Showtime Mixed': 'showtime_mixed'
  };

  const MAX_RECENT_TIMESTAMPS = 10;
  const MEAN_PLUS = 'Mean + Standard Deviation';
  const MEDIAN_PLUS = 'Median + Median Deviation';
  const MDTD = 'Max Discovery Time Delta';

  const SERVER_COUNTS = [4, 16];

  const STAT_NAMES = {
    Minimum: 'min',
    Maximum: 'max',
    [MEAN_PLUS]: 'mean',
    [MEDIAN_PLUS]: 'median'
  };

  const STAT_TYPES = [
    'Latency',
    'Jitter',
    'Round Trip Latency',
    'Round Trip Jitter'
  ];

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
  let dataSetDisplayName = 'Echo RTPS';
  let recentCount = 5;
  let serverCount = 16;
  let statDisplayName = MEAN_PLUS;
  let statistics;
  let statType = 'Latency';
  let useLogScale = false;
  let useTimeSeries = false;

  onMount(loadData);

  $: axis = chartType === 'by timestamp' ? axisByTimestamp : axisBySize;
  $: axis.x.label.text =
    chartType === 'by timestamp'
      ? 'timestamp'
      : dataSet === 'disco' || dataSet.startsWith('showtime_')
      ? 'nodes'
      : 'payload size';
  $: axis.y.type = useLogScale ? 'log' : 'linear';
  $: dataSet = DATA_SETS[dataSetDisplayName];
  $: statName = STAT_NAMES[statDisplayName];
  $: statTypes =
    dataSet === 'showtime_mixed'
      ? STAT_TYPES.filter(st => !st.startsWith('Round Trip'))
      : STAT_TYPES;
  $: title = `${dataSetDisplayName} - ${statType} - ${statDisplayName}`;

  $: if (statistics) {
    data.columns = [];

    if (chartType === 'by timestamp') {
      getChartDataByTimestamp(
        dataSet,
        serverCount,
        statType,
        statName,
        recentCount
      );
    } else {
      getChartDataBySize(dataSet, serverCount, statType, statName, recentCount);
    }

    if (axis) axis.y.label.text = statDisplayName;
  }

  function dataSetChanged(event) {
    const {value} = event.target;
    if (value === 'Discovery') {
      statDisplayName = MDTD;
      statName = 'maxDiscoveryTimeDelta';
    } else if (statDisplayName === MDTD) {
      statDisplayName = MEAN_PLUS;
      statName = 'mean';
    }
  }

  async function getChartDataBySize(dataSet, serverCount, statType, statName) {
    if (!dataSet || !statName || !statType) return;

    const isDiscovery = dataSet === 'disco';
    const timestamps = getTimestamps();
    const sizes = getSizes();
    const arr = ['x', ...sizes];
    const columns = [arr];

    data = {...data, columns};

    for (const timestamp of timestamps) {
      const column = [timestamp.split('+')[0]];
      for (const size of sizes) {
        let value = 0;

        const key = dataSet.startsWith('fan') ? size + '_' + serverCount : size;
        let obj = statistics[timestamp][dataSet];
        if (obj) {
          obj = obj[key];
          if (obj) {
            if (isDiscovery) {
              value = obj[MDTD];
            } else {
              const stats = obj[statType];
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
    dataSet,
    serverCount,
    statType,
    statName
  ) {
    if (!dataSet || !statName || !statType) return;

    const isDiscovery = dataSet === 'disco';
    const isFan = dataSet.startsWith('fan_');

    const timestamps = getTimestamps();
    const xValues = timestamps.map(timestamp => timestamp.split('+')[0]);
    const arr = ['x', ...xValues];
    const columns = [arr];

    const dataNames = getDataNames();

    for (const dataName of dataNames) {
      const column = [dataName];
      for (const timestamp of timestamps) {
        let value = 0;

        const dataForName = statistics[timestamp][dataSet];
        if (dataForName) {
          const obj =
            dataForName[isFan ? dataName + '_' + serverCount : dataName];
          if (obj) {
            if (isDiscovery) {
              value = obj[MDTD];
            } else {
              const stats = obj[statType];
              if (stats) value = stats[statName];
            }
          }
        }

        column.push(value);
      }
      columns.push(column);
    }

    const xFormat = '%Y-%m-%dT%H:%M:%S'; // data format
    data = {...data, columns, xFormat};
  }

  function getDataNames() {
    const isFan = dataSet.startsWith('fan_');

    const dataNames = new Set();
    const timestamps = Object.keys(statistics);
    for (const timestamp of timestamps) {
      const obj = statistics[timestamp][dataSet];
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

  function getSizes() {
    const isFan = dataSet.startsWith('fan_');

    const sizes = new Set();
    const timestamps = Object.keys(statistics);
    for (const timestamp of timestamps) {
      const dataSetObj = statistics[timestamp][dataSet];
      if (dataSetObj) {
        const dsSizes = Object.keys(dataSetObj);
        for (const dsSize of dsSizes) {
          if (!isFan || dsSize.endsWith('_' + serverCount)) {
            sizes.add(isFan ? dsSize.split('_')[0] : dsSize);
          }
        }
      }
    }

    return [...sizes].sort((s1, s2) => Number(s1) - Number(s2));
  }

  function getTimestamps() {
    const timestamps = Object.keys(statistics);
    const startIndex = Math.max(
      0,
      timestamps.length - Math.min(MAX_RECENT_TIMESTAMPS, recentCount)
    );
    return timestamps.slice(startIndex);
  }

  async function loadData() {
    try {
      const res = await fetch(BASE_URL + 'data');
      if (res.ok) {
        statistics = await res.json();
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
      <Select label="Chart Type" options={CHART_TYPES} bind:value={chartType} />
      {#if chartType === 'by timestamp'}
        <label>Space X values by time <input type="checkbox" bind:checked={useTimeSeries} />
        </label>
      {/if}
      <label>Log Scale for Y Axis <input type="checkbox" bind:checked={useLogScale} />
      </label>

      <Select
        label="Data Set"
        on:blur={dataSetChanged}
        on:change={dataSetChanged}
        options={Object.keys(DATA_SETS)}
        bind:value={dataSetDisplayName} />
      {#if dataSet.startsWith('fan_')}
        <Select
          label="# of Servers"
          options={SERVER_COUNTS}
          bind:value={serverCount} />
      {/if}
    </div>
    <div>
      {#if dataSet !== 'disco'}
        <Select label="Type" options={statTypes} bind:value={statType} />

        <Select
          label="Statistics"
          options={Object.keys(STAT_NAMES)}
          bind:value={statDisplayName} />
      {/if}
      <label>
        # of Recent Tests <input type="number" min="2" max={MAX_RECENT_TIMESTAMPS} bind:value={recentCount} />
      </label>
    </div>
  </form>

  <LineChart {axis} bind:data {title} />
</main>

<style>
  form {
    display: flex;
  }

  form > div {
    margin-right: 2rem;
  }
</style>
