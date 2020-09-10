<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import Select from './Select.svelte';
  import TimeSeries from './TimeSeries.svelte';

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

  const STAT_NAMES = {
    Minimum: 'min',
    Maximum: 'max',
    'Mean + Standard Deviation': 'mean',
    'Median + Median Deviation': 'median'
  };

  const STAT_TYPES = [
    'Latency',
    'Jitter',
    'Round Trip Latency',
    'Round Trip Jitter'
  ];

  const axis = {
    x: {
      label: {
        position: 'outer-left',
        text: 'Timestamp'
      },
      type: 'timeseries',
      tick: {
        culling: false,
        format: '%Y-%m-%d %H:%M:%S', // display format
        rotate: -90
      }
    },
    y: {
      label: {
        position: 'outer-middle',
        text: ''
      }
    }
  };

  let data = {
    columns: [],
    x: 'x',
    xFormat: '%Y-%m-%dT%H:%M:%S' // data format
  };

  let chartType = 'by timestamp';
  let dataSetDisplayName = 'Echo RTPS';
  let statDisplayName = 'Mean + Standard Deviation';
  let statType = 'Latency';

  $: dataSet = DATA_SETS[dataSetDisplayName];
  $: console.log('App.svelte: dataSet =', dataSet);
  $: statName = STAT_NAMES[statDisplayName];
  $: console.log('App.svelte: statName =', statName);
  $: title = `${dataSet} ${statType} ${statName}`;

  $: {
    data.columns = [];
    getChartData(dataSet, statType, statName);
  }

  async function getChartData(dataSet, statType, statName) {
    if (!dataSet || !statName || !statType) return;

    const url = BASE_URL + dataSet + '/' + statType;
    try {
      const res = await fetch(url);
      const rawData = await res.json();

      const timestamps = Object.keys(rawData);
      const xValues = timestamps.map(timestamp => timestamp.split('+')[0]);
      const [firstKey] = timestamps;
      const dataNames = Object.keys(rawData[firstKey][dataSet]);

      const arr = ['x', ...xValues];
      const columns = [arr];

      for (const dataName of dataNames) {
        const column = [dataName];
        for (const timestamp of timestamps) {
          const dataForName = rawData[timestamp][dataSet];
          if (dataForName) {
            const stats = dataForName[dataName];
            column.push(stats ? stats[statName] : 0);
          }
        }
        columns.push(column);
      }

      data = {...data, columns};
      console.log('App.svelte getChartData: data =', data);
      axis.y.label.text = statName;
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }
</script>

<main>
  <Select label="Chart Type" options={CHART_TYPES} bind:value={chartType} />
  <Select
    label="Data Set"
    options={Object.keys(DATA_SETS)}
    bind:value={dataSetDisplayName} />
  <Select label="Type" options={STAT_TYPES} bind:value={statType} />
  <Select
    label="Statistics"
    options={Object.keys(STAT_NAMES)}
    bind:value={statDisplayName} />

  <!-- <TimeSeries /> -->
  <LineChart {axis} bind:data {title} />
</main>
