<script lang="ts">
  import Chart from 'chart.js/auto';
  import {createEventDispatcher} from 'svelte';
  import {BY_SIZE, classNameFromBenchmarkKey} from './chart-data-extractor';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let axis;
  export let data;
  export let errorTicks;
  export let form;
  export let legendTitle: string;
  export let selectedTimestamps;

  const dispatch = createEventDispatcher<{rendered: void}>();
  const CHART_ID = 'open-dds-chart';

  let formattedErrors;
  let key = Date.now();
  let chartRef: any = null;

  $: scenario = form.scenario;
  $: chartType = form.chartType;

  $: if (data && data.columns.length > 0 && key) {
    console.debug('Drawing');
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    drawChart(data, axis);
  }

  const formatTime = (time: string) => {
    if (time.includes('_')) {
      const [datePart, timePart] = time.split('_');
      const [hour, minute, second] = timePart.split('-');
      return (time = `${datePart} ${hour}:${minute}:${second}`);
    }
  };

  function formatErrors() {
    formattedErrors = [];
    if (!Array.isArray(data.columns) || !Array.isArray(data.columns[0])) return;

    const selectedSet = new Set(selectedTimestamps);
    const bySize = chartType === BY_SIZE;

    const xLabels = data.columns[0].slice(1);

    const active = [...errorTicks.values()].filter(error => {
      if (!error.length) return false;
      const {scenario: es, key} = error[0];
      return es === scenario && selectedSet.has(key);
    });

    for (const error_list of active) {
      for (const error of error_list) {
        const {key, scenario: _scenario, dateTime, size} = error;

        const timestampAsClassName = classNameFromBenchmarkKey(key);

        const trimmedSize = JSON.stringify(size);
        const formattedDateTime = dateTime.replace('_', ' ');
        let className = bySize ? timestampAsClassName : trimmedSize;
        const label = bySize ? trimmedSize : formattedDateTime;
        className = formatTime(className);
        const index = xLabels.indexOf(label);
        if (index && label && className) {
          formattedErrors.push({index, label, className});
        }
      }
    }
  }

  function onRendered(theKey: any): void {
    if (theKey !== key) {
      console.debug("There's a different ref in town, skipping", theKey, key);
      return;
    }
    // chartRef.update();
    dispatch('rendered');
  }

  async function drawChart(data, axis): Promise<void> {
    const xAxis = axis.x;
    const yAxis = axis.y;
    const xAxisLabel = xAxis.label.text;
    const yAxisLabel = yAxis.label.text;
    const yAxisType = yAxis.type === 'log' ? 'logarithmic' : yAxis.type;

    if (errorTicks) formatErrors();
    let datasets = [];
    let xValues = [];

    let colors = [
      'olivegreen',
      'darkorange',
      'darkgreen',
      'purple',
      'darkblue',
      'gold',
      'magenta',
      'blueviolet',
      'darkred',
      'sienna'
    ];

    if (data && data.names && data.columns.length) {
      xValues = data.columns[0].slice(1);
      for (let i = 1; i < data.columns.length; i++) {
        let column = data.columns[i];
        let label = column[0];
        // format time so it's readable
        label = formatTime(label);
        let container = {
          data: [],
          label,
          backgroundColor: colors[i],
          borderColor: colors[i],
          pointBackgroundColor: Array(column[0].length).fill(colors[i]),
          pointRadius: 5
        };

        // set error point color
        for (const error of formattedErrors) {
          if (error.className === label) {
            container.pointBackgroundColor[error.index] = 'red';
          }
        }

        let dataSet = [];
        let yValues = column.slice(1);
        xValues.forEach((x, index) => {
          let y = yValues[index];
          dataSet.push({x, y});
        });

        container.data = dataSet;
        datasets.push(container);
      }
    }

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
              callback(value: number) {
                return yAxis.tick.format(value);
              }
            },
            type: yAxisType
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label(context) {
                context.formattedValue = yAxis.tick.format(context.parsed.y);
              }
            },
            displayColors: true,
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
