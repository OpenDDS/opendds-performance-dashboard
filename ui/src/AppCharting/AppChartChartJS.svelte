<script context="module">
  import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  } from 'chart.js';

  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  );
</script>

<script>
  import {onMount} from 'svelte';

  //----------------------------------------------------------------
  // Props
  //------------------------------------------------------------
  export let form = {};
  export let selectedTimestamps = [];

  export let benchmarks = {};
  export let timestamps = [];
  export let statProperties = {};

  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45]
      }
    ]
  };
  const config = {
    type: 'line',
    data,
    options: {}
  };

  let chart;
  // @ts-ignore
  onMount(() => {
    chart = new Chart(document.getElementById('app-chart-chart-js'), config);
  });
</script>

<div>
  <canvas id="app-chart-chart-js" />
</div>
