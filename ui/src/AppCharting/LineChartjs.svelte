<script lang="ts">
  import Chart from 'chart.js/auto';
  import {createEventDispatcher, onDestroy} from 'svelte';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let axis;
  export let data;
  export let errorTicks;
  export let legendTitle: string;

  console.log({errorTicks});

  const CHART_ID = 'open-dds-chart';
  //   const CHART_SELECTOR = '#' + CHART_ID;

  //   const LEGEND_TILE_WIDTH = 55;
  const dispatch = createEventDispatcher<{rendered: void}>();

  $: if (data && key) {
    console.debug('Drawing');
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    drawChart(data, axis);
  }

  let key = Date.now();
  let chartRef: any = null;
  //   onDestroy(() => {
  //     console.debug('Destroying Chart');
  //     chartRef?.destroy();
  //   });

  function onRendered(theKey: any): void {
    if (theKey !== key) {
      console.debug("There's a different ref in town, skipping", theKey, key);
      return;
    }
    // console.debug('Dispatching Render', key, theKey);
    // chartRef.update();
    dispatch('rendered');
  }

  async function drawChart(data, axis): Promise<void> {
    console.log({axis, data});
    const xAxis = axis.x;
    const yAxis = axis.y;
    const xAxisLabel = xAxis.label.text;
    const yAxisLabel = yAxis.label.text;
    const yAxisType = yAxis.type === 'log' ? 'logarithmic' : yAxis.type;

    let datasets = [];
    let xValues = [];

    if (data && data.names && data.columns.length) {
      xValues = data.columns[0].slice(1);
      for (let i = 1; i < data.columns.length; i++) {
        let dataSet = [];
        let column = data.columns[i];
        let label = column[0];
        if (label.includes('_')) {
          const [datePart, timePart] = label.split('_');
          const [hour, minute, second] = timePart.split('-');
          label = `${datePart} ${hour}:${minute}:${second}`;
        }

        let yValues = column.slice(1);
        xValues.forEach((x, index) => {
          let y = yValues[index];
          //   let y = parseFloat(yValues[index].toFixed(4));
          dataSet.push({x, y});
        });

        datasets.push({data: dataSet, label});
      }
    }

    console.log({datasets, xValues});

    chartRef?.destroy();
    const theKey = Date.now();
    key = theKey;
    chartRef = new Chart(CHART_ID, {
      type: 'line',
      data: {
        // labels: xValues,
        datasets
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            title: {
              display: true,
              font: {
                size: 20,
                weight: 'bold'
              },
              text: xAxisLabel
            }
          },
          y: {
            title: {
              display: true,
              font: {
                size: 20,
                weight: 'bold'
              },
              text: yAxisLabel
            },
            ticks: {
              callback: function (value: number) {
                return yAxis.tick.format(value);
              }
            },
            type: yAxisType
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                context.formattedValue = yAxis.tick.format(context.parsed.y);
              }
            },
            enabled: true
          },
          legend: {
            display: true,
            title: {
              display: true,
              font: {
                size: 20,
                weight: 'bold'
              },
              text: legendTitle
            }
          }
        }
      }
    });

    if (chartRef) {
      onRendered(theKey);
    }
  }
</script>

<div>
  <canvas id={CHART_ID} style={`min-height: ${DEFAULT_CHART_HEIGHT}px`} />
</div>
