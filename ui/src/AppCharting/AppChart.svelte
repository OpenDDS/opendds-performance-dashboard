<script context="module">
  import {
    deriveClassNameFromTimestampKey,
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE
  } from './chart-data-extractor';

  const yAxis = {
    label: {
      position: 'outer-middle',
      text: ''
    },
    min: 0, // helps with log scale
    padding: 0, // helps with log scale
    tick: {
      format(value) {
        return Number.isInteger(value) ? value : value.toFixed(4);
      }
    }
  };

  const AXIS_CONFIGURATION = {
    [BY_SIZE]: {
      x: {
        label: {
          position: 'outer-left'
        },
        type: 'category'
      },
      y: yAxis
    },
    [BY_TIMESTAMP]: {
      x: {
        label: {
          position: 'outer-left',
          text: 'Timestamp'
        },
        //type: 'category',
        tick: {
          culling: false,
          fit: false,
          format: '%Y-%m-%d %H:%M:%S', // display format
          rotate: -90
        }
      },
      y: yAxis
    }
  };

  //----------------------------------------------------------------------------
  // Pure Functions For Chart Data
  //----------------------------------------------------------------------------
  function getYLabel({plotType, statName}, {statProperties}) {
    if (!plotType) return '';
    const unit = statProperties[plotType].units;
    return [statName, unit].filter(i => i).join(' ');
  }

  function getXLabel({chartType}, {hasNodes}) {
    return chartType === BY_TIMESTAMP
      ? 'timestamp'
      : hasNodes
      ? 'nodes'
      : 'payload size in bytes';
  }

  const getLegendTitle = ({chartType}, {hasNodes}) =>
    chartType === BY_SIZE
      ? 'Timestamp'
      : hasNodes
      ? 'Node Count'
      : 'Payload Bytes';

  function getMinY({useLogScale}, {columns}) {
    if (!useLogScale || columns.length === 0) return 0;

    let minY = Number.MAX_VALUE;
    for (const column of columns) {
      const [label] = column;
      if (label !== 'x') {
        // Ignore zero values.
        const values = column.slice(1).filter(v => v !== 0);
        minY = Math.min(minY, ...values);
      }
    }
    return minY;
  }
</script>

<script>
  import LineChart from './LineChart.svelte';

  export let form;
  export let errors;
  export let chartData;
  export let statProperties;

  $: scenario = form.scenario;
  $: chartType = form.chartType;
  $: useTimeSeries = form.useTimeSeries;
  $: useLogScale = form.useLogScale;

  $: hasNodes = scenario === 'disco' || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(form, {hasNodes});
  $: title = `${form.scenario} - ${form.plotType} - ${form.statName}`;

  // Axis Configuration
  $: AXIS_CONFIGURATION[BY_TIMESTAMP].x.type = useTimeSeries
    ? 'timeseries'
    : 'category';
  $: AXIS_CONFIGURATION[BY_TIMESTAMP].x.tick.fit = useTimeSeries;
  $: axis = AXIS_CONFIGURATION[chartType];

  $: isReady = chartData && statProperties && form;

  // X and Y Label
  $: if (axis && isReady) {
    axis.y.type = useLogScale ? 'log' : 'linear';
    axis.y.min = getMinY(form, chartData);
    axis.y.label.text = getYLabel(form, {statProperties});
    axis.x.label.text = getXLabel(form, {hasNodes});
  }

  function styleErrors() {
    const selectedSet = new Set(form.selectedTimestamps);

    const bySize = chartType === BY_SIZE;

    const xLabels = chartData.columns[0].slice(1);

    const active = [...errors.values()].filter(error => {
      const {scenario, key} = error;
      return scenario === scenario && selectedSet.has(key);
    });

    // SVG circle elements for points can be found
    // with this series of CSS selectors:
    // .open-dds-chart
    // svg
    // .c3-chart
    // .c3-chart-lines
    // .c3-chart-line
    // .c3-circles-{className}
    // circle
    // where the circle elements are in order by x label.
    for (const error of active) {
      const {key, size, dateTime} = error;
      const timestampAsClassName = deriveClassNameFromTimestampKey(key);

      const trimmedSize = size.split('_')[0];
      const formattedDateTime = dateTime.replace('_', ' ');
      const className = bySize ? timestampAsClassName : trimmedSize;
      const circleGroup = document.querySelector('.c3-circles-' + className);

      if (circleGroup) {
        const label = bySize ? trimmedSize : formattedDateTime;
        const index = xLabels.indexOf(label);
        const circle = circleGroup.children.item(index);
        if (!circle) {
          console.error('circle not found', label, xLabels);
          return;
        }
        circle.style.stroke = 'red';
        circle.style.strokeWidth = 4;
      } else {
        // This should never happen.
        console.error('circle group not found');
      }
    }
  }

  function styleMissingPoints() {
    // console.log('App.svelte styleMissingPoints: data =', data);

    const {columns} = chartData;
    for (const column of columns) {
      const [timestamp] = column;
      column.forEach((value, index) => {
        if (value === MISSING_VALUE) {
          console.log(
            'App.svelte x: timestamp =',
            timestamp,
            ', index =',
            index
          );
          const g = document.querySelector('.c3-circles-' + timestamp);
          const circle = g.querySelector('.c3-circle-' + (index - 1));
          circle.style.stroke = 'orange';
          circle.style.strokeWidth = 4;
        }
      });
    }
  }

  function styleSpecialPoints() {
    styleErrors();
    styleMissingPoints();
  }
</script>

<LineChart
  {axis}
  data={chartData}
  {legendTitle}
  {title}
  on:rendered={styleSpecialPoints} />
