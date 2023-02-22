<script lang="ts">
  import {errorStore} from '../utility/stores';
  import Chart from './LineChartjs.svelte';
  import {data} from './data';
  import TempData from './TempData.json';

  import {
    chartDataFactory,
    classNameFromBenchmarkKey,
    BY_SIZE,
    BY_TIMESTAMP,
    MISSING_VALUE
  } from './chart-data-extractor';

  import type {ChartFactoryData} from './chart-data-extractor';

  import {
    axisFactory,
    getAxisYLabel,
    getAxisXLabel,
    getLegendTitle,
    getAxisXTimeStampType,
    DEFAULT_CHART_HEIGHT,
    getAxisYConfigurationPartials,
    getAxisYTickFormat
  } from './chart-layout-helpers';
  import type {
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    Scenario,
    StatProperties,
    TimestampViewModel
  } from '../types';
  import {configParamMap, sizeParamMap} from '../utility/param-map';

  type ErrorEntry = {
    key: BenchmarkIdentifier;
    scenario: Scenario;
    dateTime: string;
    size: string;
  };

  //----------------------------------------------------------------
  // Props
  //------------------------------------------------------------
  export let form: FormConfiguration;
  export let selectedTimestamps: BenchmarkIdentifier[];

  export let benchmarks: Benchmarks = {};
  export let timestamps: TimestampViewModel[] = [];
  export let statProperties: StatProperties;

  //----------------------------------------------------------------
  // Local State
  //------------------------------------------------------------
  let errors = new Map<BenchmarkIdentifier, ErrorEntry[]>();
  let chartData: ChartFactoryData = {columns: [], x: 'x', names: {}};
  let axisConfigurations = axisFactory();

  //----------------------------------------------------------------
  // Computed Properties
  //------------------------------------------------------------
  $: scenario = form.scenario;
  $: chartType = form.chartType;

  $: isReady = benchmarks && statProperties && form && true;

  $: hasNodes =
    scenario.startsWith('disco') || scenario.startsWith('showtime_');
  $: legendTitle = getLegendTitle(form, {hasNodes});

  // Axis Configuration
  $: axisConfigurations[BY_TIMESTAMP].x.type = getAxisXTimeStampType(form);
  $: axisConfigurations[BY_TIMESTAMP].x.tick.fit = form.useTimeSeries;
  $: axis = axisConfigurations[chartType];
  $: console.log({
    scenario,
    chartType,
    isReady,
    hasNodes,
    legendTitle,
    axisConfigurations,
    axis
  });

  // X and Y Label
  $: if (chartData && axis && isReady) {
    const partials = getAxisYConfigurationPartials(form);
    Object.assign(axis.y, partials);

    axis.y.tick.format = getAxisYTickFormat(form, {
      statProperties,
      columns: chartData.columns
    });
    if (typeof axis.y.label !== 'string') {
      axis.y.label.text = getAxisYLabel(form, {statProperties});
    }
    if (typeof axis.x.label !== 'string') {
      axis.x.label.text = getAxisXLabel(form, {hasNodes});
    }
  }

  $: if (isReady) {
    const selected = timestamps.filter(({key}) => {
      return selectedTimestamps.indexOf(key) !== -1;
    });

    const factory = chartDataFactory(chartType);
    factory(benchmarks, selected, form).then(onLoaded).catch(onError);
  }

  $: deriveDataPointErrors(benchmarks);

  //----------------------------------------------------------------
  // Event Listeners
  //------------------------------------------------------------
  function onLoaded(results: ChartFactoryData) {
    if (!results) return;
    chartData = results;
  }

  function onError(error: Error) {
    errorStore.onError(error);
  }

  //----------------------------------------------------------------
  // Methods
  //------------------------------------------------------------
  // $: console.log('Benchmarks Rerendered', benchmarks);
  // $: console.log('Chart Data Changed', chartData);
  function deriveDataPointErrors(benchmarks: Benchmarks) {
    errors.clear();
    // console.log('Clearing Errors');

    for (const [timestamp, timeData] of Object.entries(benchmarks)) {
      const dateTime = getTimeKey(timestamp);
      for (const [, sData] of Object.entries(timeData).filter(
        ([key]) => key != 'run_parameters'
      )) {
        if (sData.Errors) {
          const sParams = sData['scenario_parameters'];
          if (sParams) {
            const sBase = sParams['Base'];
            const sConfig = sParams['Config'];
            const sName = sConfig
              ? sBase +
                '-' +
                (configParamMap[sConfig] ? configParamMap[sConfig] : sConfig)
              : sBase;
            const sSize = sParams[sizeParamMap[sBase]];
            if (sSize) {
              const id = [sName, timestamp].join('|');
              const new_error = {
                key: timestamp,
                scenario: <Scenario>sName,
                dateTime,
                size: sSize
              };
              if (errors.has(id)) {
                errors.get(id).push(new_error);
              } else {
                errors.set(id, [new_error]);
              }
            }
          }
        }
      }
      //for (const [scenario, scenarioData] of Object.entries(timeData)) {
      //  for (const [size, sizeData] of Object.entries(scenarioData)) {
      //    if (sizeData.Errors) {
      //      const id = [scenario, timestamp].join('|');
      //      const new_error = {
      //        key: timestamp,
      //        scenario: <Scenario>scenario,
      //        dateTime,
      //        size
      //      };
      //      if (errors.has(id)) {
      //        errors.get(id).push(new_error);
      //      } else {
      //        errors.set(id, [new_error]);
      //      }
      //    }
      //  }
      //}
    }
  }

  function getTimeKey(timestamp: string): string {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function styleDataPointErrors() {
    if (
      !Array.isArray(chartData.columns) ||
      !Array.isArray(chartData.columns[0])
    )
      return;

    const selectedSet = new Set(selectedTimestamps);
    const bySize = chartType === BY_SIZE;

    const xLabels = chartData.columns[0].slice(1);

    const active = [...errors.values()].filter(error => {
      if (!error.length) return false;
      const {scenario: es, key} = error[0];
      return es === scenario && selectedSet.has(key);
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
    let error_count = 0;
    let circle_count = 0;
    let missed_circle_count = 0;
    for (const error_list of active) {
      for (const error of error_list) {
        error_count++;
        const {key, scenario: _scenario, dateTime, size} = error;
        const timestampAsClassName = classNameFromBenchmarkKey(key);

        const trimmedSize = JSON.stringify(size);
        const formattedDateTime = dateTime.replace('_', ' ');
        const className = bySize ? timestampAsClassName : trimmedSize;
        const circleGroup = document.querySelector('.c3-circles-' + className);

        if (circleGroup) {
          const label = bySize ? trimmedSize : formattedDateTime;
          const index = xLabels.indexOf(label);
          const circle = <SVGElement>circleGroup.children.item(index);
          if (circle) {
            circle_count++;
            circle.style.stroke = 'red';
            circle.style.strokeWidth = '4';
          } else {
            missed_circle_count++;
          }
        } else {
          // This should never happen.
          console.error('circle group not found for className =', className);
        }
      }
    }
    console.log(
      'considered',
      active.length,
      'error lists,',
      error_count,
      'individual errors, and updated',
      circle_count,
      'circles, with',
      missed_circle_count,
      'misses'
    );
  }

  $: console.log('DATA', chartData);

  $: redrawKey = chartType || chartData || axis || Date.now();
</script>

{#key redrawKey}
  <Chart {axis} data={chartData} {legendTitle} />
{/key}
