<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';
  import TimeSeries from './TimeSeries.svelte';

  const BASE_URL = 'http://localhost:1919/';
  const DATA_NAME = 'echo_rtps';
  const STAT_TYPE = 'Latency';

  const axis = {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d %H:%M:%S' // display format
      }
    }
  };

  let data = {
    x: 'x',
    xFormat: '%Y-%m-%dT%H:%M:%S', // data format
    columns: []
  };

  onMount(() => getChartData(DATA_NAME, STAT_TYPE));

  async function getChartData(name, statType) {
    const url = BASE_URL + name + '/' + statType;
    console.log('App.svelte getChartData: url =', url);
    try {
      const res = await fetch(url);
      const rawData = await res.json();
      console.log('App.svelte getChartData: rawData =', rawData);
      //TODO: NOT PROCESSING EMPTY VALUES CORRECTLY!
      const timestamps = Object.keys(rawData);
      const xValues = timestamps.map(timestamp => timestamp.split('+')[0]);
      const [firstKey] = timestamps;
      const dataNames = Object.keys(rawData[firstKey][name]);

      const arr = ['x', ...xValues];
      const columns = [arr];

      for (const dataName of dataNames) {
        const column = [dataName];
        for (const timestamp of timestamps) {
          const dataForName = rawData[timestamp][name];
          if (dataForName) column.push(dataForName[dataName].mean);
        }
        columns.push(column);
      }

      data.columns = columns;
      console.log('App.svelte x: data =', data);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }
</script>

<main>
  <!-- <TimeSeries /> -->
  <LineChart {axis} bind:data title={DATA_NAME + ' ' + STAT_TYPE} />
</main>
