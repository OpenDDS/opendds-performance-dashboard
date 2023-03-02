<script lang="ts">
  import Chart from 'chart.js/auto';
  import {BY_SIZE, classNameFromBenchmarkKey} from './chart-data-extractor';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let axis;
  export let data;
  export let errorTicks;
  export let form;
  export let legendTitle: string;
  export let selectedTimestamps;

  const CHART_ID = 'open-dds-chart';

  let formattedErrors;
  let chartRef: any = null;

  $: scenario = form.scenario;
  $: chartType = form.chartType;

  $: if (data && data.columns.length > 0) {
    console.debug('Drawing');
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    drawChart(data, axis);
  }

  function formatTime(time: string) {
    if (!time.includes('_')) return time;
    const [datePart, timePart] = time.split('_');
    const [hour, minute, second] = timePart.split('-');
    return `${datePart} ${hour}:${minute}:${second}`;
  }

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

  async function drawChart(data, axis): Promise<void> {
    const xAxis = axis.x;
    const yAxis = axis.y;
    const xAxisLabel = xAxis.label.text;
    const yAxisLabel = yAxis.label.text;
    const yAxisType = yAxis.type === 'log' ? 'logarithmic' : yAxis.type;

    if (errorTicks) formatErrors();
    let datasets = [];
    let xValues = [];

    const getRandomColor = () => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return `#${randomColor}`;
    };

    if (data && data.names && data.columns.length) {
      xValues = data.columns[0].slice(1);
      for (let i = 1; i < data.columns.length; i++) {
        let randomColor = getRandomColor();
        const column = data.columns[i];
        let label = column[0];

        // format time for chart legend
        label = formatTime(label);
        const color = randomColor;
        const container = {
          data: [],
          label,
          backgroundColor: color,
          borderColor: color,
          pointBackgroundColor: Array(column[0].length).fill(color),
          pointRadius: 5
        };

        // set error point color
        for (const error of formattedErrors) {
          if (error.className === label) {
            container.pointBackgroundColor[error.index] = 'red';
          }
        }

        const dataSet = [];
        const yValues = column.slice(1);
        xValues.forEach((x, index) => {
          const y = yValues[index];
          dataSet.push({x, y});
        });

        container.data = dataSet;
        datasets.push(container);
      }
    }

    chartRef?.destroy();
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
              },
              labelColor(context) {
                return {
                  borderColor: context.dataset.backgroundColor,
                  backgroundColor: context.dataset.backgroundColor
                };
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
  }
</script>

<div>
  <canvas id={CHART_ID} style={`min-height: ${DEFAULT_CHART_HEIGHT}px`} />
</div>
