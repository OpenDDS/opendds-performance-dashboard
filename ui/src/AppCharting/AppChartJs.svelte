<script lang="ts">
  import {errorStore} from '../utility/stores';
  import Chart from './LineChartjs.svelte';

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
    getAxisYConfigurationPartials,
    getAxisYTickFormat
  } from './chart-layout-helpers';
  import type {
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    Primitive,
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
  //   $: console.log('CHARTJS', {
  //     scenario,
  //     chartType,
  //     isReady,
  //     hasNodes,
  //     legendTitle,
  //     axisConfigurations,
  //     axis
  //   });

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
    }
  }

  function styleMissingPointIfFound(
    timestamp: string,
    value: Primitive,
    index: number
  ): void {
    if (value !== MISSING_VALUE) return;
    const g = document.querySelector('.c3-circles-' + timestamp);
    if (!g) return;

    const circle = <SVGElement>g.querySelector('.c3-circle-' + (index - 1));
    if (!circle) return;

    circle.style.stroke = 'orange';
    circle.style.strokeWidth = '4';
  }

  function getTimeKey(timestamp: string): string {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function styleMissingPoints() {
    // console.log('App.svelte styleMissingPoints: data =', data);
    const {columns} = chartData;

    for (const column of columns) {
      const [timestamp] = column;
      for (let index = 0; index < column.length; index++) {
        const value = column[index];
        styleMissingPointIfFound(timestamp, value, index);
      }
    }
  }

  function styleSpecialPoints() {
    // Microtask Hack.
    setTimeout(() => {
      styleDataPointErrors();
      styleMissingPoints();
    }, 0);
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
    console.log({active});

    let error_count = 0;
    for (const error_list of active) {
      for (const error of error_list) {
        error_count++;
        const {key, scenario: _scenario, dateTime, size} = error;
        const timestampAsClassName = classNameFromBenchmarkKey(key);

        const trimmedSize = JSON.stringify(size);
        const formattedDateTime = dateTime.replace('_', ' ');
        const className = bySize ? timestampAsClassName : trimmedSize;
        // const circleGroup = document.querySelector('.c3-circles-' + className);

        const label = bySize ? trimmedSize : formattedDateTime;
        const index = xLabels.indexOf(label);
        console.log({index, label});
      }
    }
  }

  $: console.log('DATA', chartData);

  $: redrawKey = chartType || chartData || axis || Date.now() || errors;
</script>

{#key redrawKey}
  <Chart
    {axis}
    data={chartData}
    {form}
    {legendTitle}
    errorTicks={errors}
    {selectedTimestamps}
    on:rendered{styleSpecialPoints}
  />
{/key}
