<script>
  import {onMount} from 'svelte';
  import LineChart from './LineChart.svelte';

  const BASE_URL = 'http://localhost:1919/';

  let data = {
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
  };

  onMount(() => getChartData('echo_rtps', 'Latency'));

  async function getChartData(name, statType) {
    const url = BASE_URL + name + '/' + statType;
    console.log('App.svelte getChartData: url =', url);
    try {
      const res = await fetch(url);
      const rawData = await res.json();
      console.log('App.svelte getChartData: rawData =', rawData);
      const timestamps = Object.keys(rawData);
      const xValues = timestamps.map(timestamp => timestamp.split('+')[0]);
      console.log('App.svelte x: xValues =', xValues);
      const [firstKey] = timestamps;
      console.log('App.svelte x: firstKey =', firstKey);
      const dataNames = Object.keys(rawData[firstKey][name]);
      console.log('App.svelte x: dataNames =', dataNames);
      const columns = [];
      for (const dataName of dataNames) {
        const column = [];
        for (const timestamp of timestamps) {
          const dataForName = rawData[timestamp][name];
          if (dataForName) column.push(dataForName[dataName].mean);
        }
        columns.push(column);
      }
      console.log('App.svelte x: columns =', columns);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }
</script>

<main>
  <LineChart {data} title="Sample Chart" />
</main>
