<script lang="ts">
  import Chart from 'chart.js/auto';
  import {createEventDispatcher, onDestroy} from 'svelte';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';
  import LineChart from './LineChart.svelte';

  export let axis;
  export let data;
  export let legendTitle: string;
  //   export let height: number;

  const CHART_ID = 'open-dds-chart';
  const CHART_SELECTOR = '#' + CHART_ID;

  const LEGEND_TILE_WIDTH = 55;
  const dispatch = createEventDispatcher<{rendered: void}>();

  $: if (data || key) {
    console.debug('Drawing');
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    drawChart(data, axis);
  }

  let key = Date.now();
  let chartRef: any = null;
  onDestroy(() => {
    console.debug('Destroying Chart');
    chartRef?.destroy();
  });

  function onRendered(theKey: any): void {
    if (theKey !== key) {
      console.debug("There's a different ref in town, skipping", theKey, key);
      return;
    }
    // console.debug('Dispatching Render', key, theKey);
    addLegendTitle();
    dispatch('rendered');
  }

  function addLegendTitle(): void {
    const chart = document.querySelector(CHART_SELECTOR);
    // If we don't have a chart, we can't add a legend title.
    if (!chart) return;

    // If there are no legend items then no title is needed.
    const firstLegendItem = chart.querySelector(CHART_SELECTOR);
    console.log('LEGEND TITLE', firstLegendItem);
    if (!firstLegendItem) return;

    // Get the relative position of the first legend item.
    const itemText = <SVGElement>firstLegendItem.firstChild;
    console.log({itemText});

    const legendX: string = itemText.getAttribute('x');
    const legendY: string = itemText.getAttribute('y');

    // Get the SVG group element that contains the legend.
    const legendContainer = firstLegendItem.parentElement;
    console.log({itemText, legendX, legendY, legendContainer});

    // If we don't already have a text element for the title,
    // create it and insert it before the legend container.
    let legendTitleText = chart.querySelector('.legend-title');
    if (!legendTitleText) {
      legendTitleText = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      legendTitleText.setAttribute('class', 'legend-title');
      legendContainer.parentElement.insertBefore(
        legendTitleText,
        legendContainer
      );
    }

    // Set the text and position of the legend title.
    legendTitleText.textContent = legendTitle;
    legendTitleText.setAttribute(
      'x',
      (Number(legendX).valueOf() - LEGEND_TILE_WIDTH - 6).toString()
    );
    legendTitleText.setAttribute('y', (Number(legendY) - 20).toString());
    legendTitleText.setAttribute(
      'transform',
      legendContainer.getAttribute('transform')
    );
  }

  async function drawChart(data, axis): Promise<void> {
    console.log({axis, data});
    console.log('Y AXIS', axis.y.label.text);
    console.log('X AXIS', axis.x.label.text);
    const xAxisLabel = axis.x.label.text;
    const yAxisLabel = axis.y.label.text;

    console.log({xAxisLabel, yAxisLabel});
    let datasets = [];
    let xValues = [];
    if (data && data.names && data.columns.length) {
      xValues = data.columns[0].slice(1);
      for (let i = 1; i < data.columns.length; i++) {
        let dataSet = [];
        let column = data.columns[i];
        let label = column[0];
        let yValues = column.slice(1);
        xValues.forEach((x, index) => {
          let y = yValues[index];
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
              text: xAxisLabel
            }
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: true
          }
          //   legend: {
          //     display: true,
          //     labels: {
          //       color: 'rgb(255, 99, 132)'
          //     },
          //     title: {
          //       text: 'Timestamps'
          //     }
          //   }
        }
      }
    });
    if (chartRef) {
      chartRef.update();
      onRendered(theKey);
    }
  }
</script>

<div>
  <canvas id={CHART_ID} style={`min-height: ${DEFAULT_CHART_HEIGHT}px`} />
</div>
