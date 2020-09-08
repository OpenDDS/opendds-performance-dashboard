<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';

  const BASE_URL = 'http://localhost:1919/';
  const DATA_NAME = 'echo_rtps';
  const STAT_TYPE = 'Latency';

  const axis = {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d %H:%M:%S' // how displayed
      }
    }
  };

  let data = {
    /*
    xs: {
      data1: 'x1',
      data2: 'x2'
    },
    columns: [
      ['x1', 10, 30, 45, 50, 70, 100],
      ['x2', 30, 50, 75, 100, 120],
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 20, 180, 240, 100, 190]
    ]
    */
    x: 'x',
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
      const timestamps = Object.keys(rawData);
      const xValues = timestamps.map(timestamp => timestamp.split('+')[0]);
      const [firstKey] = timestamps;
      const dataNames = Object.keys(rawData[firstKey][name]);

      const arr = ['x'];
      for (let i = 0; i < dataNames.length; i++) {
        //arr.push(i);
        arr.push(xValues[i]);
      }
      const columns = [arr];

      for (const dataName of dataNames) {
        const column = [dataName];
        for (const timestamp of timestamps) {
          const dataForName = rawData[timestamp][name];
          if (dataForName) column.push(dataForName[dataName].mean);
        }
        columns.push(column);
      }

      //data = {xFormat: '%Y-%m-%dT%H:%M:%S', x: 'x', columns};
      data = {x: 'x', columns};
      console.log('App.svelte x: data =', data);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }
</script>

<main>
  <LineChart {axis} bind:data title={DATA_NAME + ' ' + STAT_TYPE} />
</main>
