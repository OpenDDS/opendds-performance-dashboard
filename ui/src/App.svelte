<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import TimeSeries from './TimeSeries.svelte';

  const BASE_URL = 'http://localhost:1919/';

  const DATA_SETS = [
    'disco',
    'echo_rtps',
    'echo_tcp',
    'fan_rtps',
    'fan_tcp',
    'showtime_mixed'
  ];

  const STAT_NAMES = [
    'count',
    'min',
    'max',
    'mean',
    'stdev',
    'median',
    'madev'
  ];

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
        rotate: 45
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
    x: 'x',
    xFormat: '%Y-%m-%dT%H:%M:%S', // data format
    columns: []
  };

  let dataSet = 'echo_rtps';
  let statName = 'mean';
  let statType = 'Latency';

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
  <label>
    Data Set <select bind:value={dataSet}>
      {#each DATA_SETS as dataSet}
        <option>{dataSet}</option>
      {/each}
    </select>
  </label>
  <label>
    Type <select bind:value={statType}>
      {#each STAT_TYPES as statType}
        <option>{statType}</option>
      {/each}
    </select>
  </label>
  <label>
    Statistic <select bind:value={statName}>
      {#each STAT_NAMES as name}
        <option>{name}</option>
      {/each}
    </select>
  </label>

  <!-- <TimeSeries /> -->
  <LineChart {axis} bind:data {title} />
</main>
