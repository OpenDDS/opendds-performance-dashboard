<script lang="ts">
  import Chart from 'chart.js/auto';
  import {filteredDataStore} from '../utility/stores';
  import {BY_SIZE, classNameFromBenchmarkKey} from './chart-data-extractor';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let axis;
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
    console.log('getXandLegendValues', {data});

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

  function getYValues(data, value) {
    const values = [];
    const dataOptions = [];
    console.log({data, value});
    if (form.xAxis === 'Timestamp') {
      // console.log('X AXIS IS TIMESTAMP', form.legend);
      data.forEach(option => {
        // console.log('LEGEND', {option, value});
        if (option.data['scenario_parameters'][form.legend] === value)
          dataOptions.push(option);
      });
      dataOptions.forEach(option => {
        values.push(option.data[form.plotType][form.statName]);
      });
      // console.log('LEGEND', {data, dataOptions, values});
      return values;
    } else {
      data.forEach(option => {
        if (option.data['scenario_parameters'][form.xAxis] === value) {
          // console.log('XAXIS', {option, value});
          dataOptions.push(option);
        }
      });
      dataOptions.forEach(option => {
        values.push(option.data[form.plotType][form.statName]);
      });
      return values;
    }
  }

  let legendValues;
  let xValues;

  $: if (
    $filteredDataStore &&
    $filteredDataStore['columns'] &&
    form.legend &&
    form.xAxis
  ) {
    legendValues = getXandLegendValues($filteredDataStore, 'legend');
    xValues = getXandLegendValues($filteredDataStore, 'xAxis');
    console.log('GETTING X AND LEGEND VALUES', {legendValues, xValues});
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

  async function drawChart(data, axis): Promise<void> {
    console.log({axis, data});

    // const xAxis = axis.x;
    const yAxis = axis.y;
    // const xAxisLabel = xAxis.label.text;
    const xAxisLabel = form.xAxis;
    const yAxisLabel = yAxis.label.text;
    // const xAxisType = xAxis.type;
    const yAxisType = yAxis.type;

    if (errorTicks) formatErrors();
    let datasets = [];

    // with labels, this will only work if there are the same number of labels as datasets (4 timestamps, bytes etc.)

    // TODO: this for loop should be when (key)timestamps are selected for xaxis or legend, need to write other loop
    // if (legendValues.length && xValues.length === data.columns.length) {

    if (data.columns.length) {
      const usesTimesStamps =
        form.xAxis === 'Timestamp' ||
        form.legend === 'Timestamp' ||
        form.timestamp;

      const count = usesTimesStamps ? data.columns.length : legendValues.length;
      for (let j = 0; j < count; j++) {
        if (legendValues[j] === undefined) continue;

        // Try adding labels to each dataset after calculating all yValues at the end of xValues loop?
        // do second for loop to calculate y values and push to container data?
        const label = legendValues[j];
        const color = colors[j];

        const container = {
          data: [],
          label,
          backgroundColor: color,
          borderColor: color,
          pointBackgroundColor: colors[j],
          pointRadius: 5
        };

        let columnArray = Object.values(data['columns'])[j];
        const set = Object.values(columnArray)[0];
        if (set.length) {
          console.log({set, columnArray});

          const dataSet = [];
          // let yValues = [];
          // refactor this
          // if (data.columns.length > legendValues.length) {
          // }
          if (form.xAxis === 'Timestamp') {
            // const x = xValues[j];
            legendValues.forEach(legend => {
              // yValues.push(getYValues(set, legend));
              const yValues = getYValues(set, legend);
              console.log({yValues, legend});

              for (const y of yValues) {
                dataSet.push({x: legend, y});
              }
            });
          } else {
            xValues.forEach(x => {
              // yValues.push(getYValues(set, x));
              // const yValuesTest = getYValues(set, x);
              const yValues = getYValues(set, x);
              console.log({yValues});

              const y = yValues[0];
              console.log({y});
              dataSet.push({x, y});
            });
          }

          console.log({dataSet});

          // set error point color
          for (const error of formattedErrors) {
            if (error.className === label) {
              // container.posintBackgroundColor[error.index] = 'red';
            }
          }

          // xValues.forEach((x, index) => {
          //   // yValues.push(getYValues(set, x));
          //   const y = yValues[index];
          //   y?.forEach(y => {
          //     dataSet.push({x, y});
          //   });
          //   // dataSet.push({x, y});
          // });

          container.data = dataSet;
          datasets.push(container);
          console.log({container, datasets});
        }
      }
    }

    chartRef?.destroy();
    chartRef = new Chart(CHART_ID, {
      type: 'line',
      data: {
        // xValues has to contain the same amount of elements as the dataset with the most values...
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
