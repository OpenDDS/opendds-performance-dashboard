<script lang="ts">
  import Chart from 'chart.js/auto';
  import {filteredDataStore} from '../utility/stores';
  import {BY_SIZE, classNameFromBenchmarkKey} from './chart-data-extractor';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let axis;
  // export let data;
  export let errorTicks;
  export let form;
  export let selectedTimestamps;

  const CHART_ID = 'open-dds-chart';

  let chartRef: any = null;
  let formattedErrors = [];

  // onDestroy(() => {
  //   console.debug('Destroying Chart');
  //   chartRef?.destroy();
  // });

  $: scenario = form.scenario;
  $: chartType = form.chartType;
  // let drawIt = false;

  $: if (
    $filteredDataStore &&
    $filteredDataStore['columns']?.length > 0 &&
    axis &&
    legendValues?.length &&
    xValues?.length
  ) {
    console.warn('Drawing chart', {legendValues, xValues});
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    // chartRef?.destroy();
    // let chartStatus = Chart.getChart('open-dds-chart'); // <canvas> id
    // if (chartStatus != undefined) {
    //   chartStatus.destroy();
    // }
    drawChart($filteredDataStore, axis);
  }

  function formatTime(time: string) {
    if (!time.includes('_')) return time;
    const [datePart, timePart] = time.split('_');
    const [hour, minute, second] = timePart.split('-');
    return `${datePart} ${hour}:${minute}:${second}`;
  }

  function formatErrors() {
    if (
      !Array.isArray($filteredDataStore['columns']) ||
      !Array.isArray($filteredDataStore['columns'][0])
    )
      return;

    const selectedSet = new Set(selectedTimestamps);
    const bySize = chartType === BY_SIZE;

    const xLabels = $filteredDataStore['columns'][0].slice(1);

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

  function getXandLegendValues(data, name: 'xAxis' | 'legend') {
    const values = new Set();

    if (name === 'xAxis' && form.xAxis === 'Timestamp') {
      data.columns.forEach(column => {
        values.add(Object.keys(column).toString());
      });
      return [...values];
    }
    if (name === 'legend' && form.legend === 'Timestamp') {
      data.columns.forEach(column => {
        values.add(Object.keys(column).toString());
      });
      return [...values];
    }

    data.columns.forEach(option => {
      const key = Object.keys(option)[0];
      let data = option[key];
      data = data.map(item => {
        let res = item.data['scenario_parameters'];
        for (const key in res) {
          // add values based on form
          if (name === 'xAxis' ? key === form.xAxis : key === form.legend) {
            values.add(res[key]);
          }
        }
      });
    });
    // console.log([...values].sort((n1, n2) => Number(n1) - Number(n2)));
    return [...values].sort((n1, n2) => Number(n1) - Number(n2));
  }

  function getYValues(data, xValue) {
    // console.log({data, xValue});

    // if (form.xAxis === 'Timestamp') {
    //   // TODO: make work for timestamps
    //   return;
    // }
    const values = new Set();
    const dataOptions = [];
    data.forEach(option => {
      if (option.data['scenario_parameters'][form.xAxis] === xValue)
        dataOptions.push(option);
    });
    dataOptions.forEach(option => {
      values.add(option.data[form.plotType][form.statName]);
    });
    return values;
  }

  let legendValues;
  let xValues;

  $: if ($filteredDataStore['columns']) {
    legendValues = getXandLegendValues($filteredDataStore, 'legend');
    xValues = getXandLegendValues($filteredDataStore, 'xAxis');
    // console.log('GETTING X AND LEGEND VALUES', {legendValues, xValues});
  }

  const colors = [
    'olivegreen',
    'darkorange',
    'darkgreen',
    'purple',
    'darkblue',
    'gold',
    'magenta',
    'blueviolet',
    'darkred',
    'sienna',
    'deepskyblue',
    'gray',
    'lightpink',
    'lightsalmon',
    'limegreen',
    'mediumpurple'
  ];

  // function determineChartData() {
  //   let datasets = [];
  //   if (legendValues.length === data.columns.length)
  //     for (let j = 0; j < data.columns.length; j++) {
  //       let columnArray = <any>Object.values(data['columns'])[j];
  //       let label;
  //       let color;
  //       if (legendValues[j] !== undefined) {
  //         label = legendValues[j];
  //         color = colors[j];
  //       }
  //       const container = {
  //         data: [],
  //         label,
  //         backgroundColor: color,
  //         borderColor: color,
  //         pointBackgroundColor: colors[j],
  //         pointRadius: 5
  //       };
  //       const set = Object.values(columnArray)[0];

  //       let yValues = [];
  //       xValues.forEach(x => {
  //         yValues.push(getYValues(set, x));
  //       });

  //       // set error point color
  //       for (const error of formattedErrors) {
  //         if (error.className === label) {
  //           // container.posintBackgroundColor[error.index] = 'red';
  //         }
  //       }

  //       const dataSet = [];

  //       xValues.forEach((x, index) => {
  //         const y = yValues[index];
  //         y.forEach(y => {
  //           dataSet.push({x, y});
  //         });
  //       });

  //       container.data = dataSet;
  //       datasets.push(container);
  //     }
  // }

  async function drawChart(data, axis): Promise<void> {
    console.log({axis, data});

    const xAxis = axis.x;
    const yAxis = axis.y;
    // const xAxisLabel = xAxis.label.text;
    const xAxisLabel = form.xAxis;
    const yAxisLabel = yAxis.label.text;
    const xAxisType = xAxis.type;
    const yAxisType = yAxis.type;

    if (errorTicks) formatErrors();
    let datasets = [];

    // with labels, this will only work if there are the same number of labels as datasets (4 timestamps, bytes etc.)
    if (data.columns.length) {
      // TODO: this for loop should be when (key)timestamps are selected, need to write other loop
      for (let j = 0; j < data.columns.length; j++) {
        let columnArray = <any>Object.values(data['columns'])[j];
        let label;
        let color;
        if (legendValues[j] !== undefined) {
          label = legendValues[j];
          color = colors[j];
        }
        // console.log({label, legendValues, j});
        const container = {
          data: [],
          label,
          backgroundColor: color,
          borderColor: color,
          pointBackgroundColor: colors[j],
          pointRadius: 5
        };
        const set = Object.values(columnArray)[0];

        let yValues = [];
        xValues.forEach(x => {
          yValues.push(getYValues(set, x));
        });

        // console.log({set, container});

        // set error point color
        for (const error of formattedErrors) {
          if (error.className === label) {
            // container.posintBackgroundColor[error.index] = 'red';
          }
        }

        const dataSet = [];

        // const yValues = Object.values(set).slice(1);
        xValues.forEach((x, index) => {
          // yValues.push(getYValues(set, x));
          const y = yValues[index];
          y.forEach(y => {
            dataSet.push({x, y});
          });
          // dataSet.push({x, y});
        });
        // console.log({yValues});
        // dataSet.push({x: 10, y: 20}, {x: 10, y: 15}, {x: 10, y: 13});
        // Object.assign(dataSet, ({x, y});

        container.data = dataSet;
        datasets.push(container);
        // console.log({container, datasets});

        // }
      }
    }

    chartRef?.destroy();
    chartRef = new Chart(CHART_ID, {
      type: 'line',
      data: {
        labels: xValues,
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
            // type: xAxisType
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
            // labels: {
            //   generateLabels(chart) {
            //     if (legendValues.length) {
            //       chart.legend.legendItems = legendValues;
            //       console.log({chart});
            //     }
            //   }
            // },
            title: {
              display: true,
              font: {
                size: 20,
                weight: 'bold'
              },
              text: form.legend
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
