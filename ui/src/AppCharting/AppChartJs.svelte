<script lang="ts">
  import {errorStore, filteredDataStore} from '../utility/stores';
  import Chart from './LineChartjs.svelte';

  import {BY_TIMESTAMP} from './chart-data-extractor';
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
    Base,
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    // FormSelectOptions,
    Scenario,
    StatProperties,
    TimestampViewModel
    // XAxisOptions
  } from '../types';
  import {configParamMap, sizeParamMap} from '../utility/param-map';

  type ErrorEntry = {
    base: Base;
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
  // export let timestamps: TimestampViewModel[] = [];
  export let statProperties: StatProperties;

  //----------------------------------------------------------------
  // Local State
  //------------------------------------------------------------
  let axisConfigurations = axisFactory();
  let errors = new Map<BenchmarkIdentifier, ErrorEntry[]>();
  // let xAxisOptions: XAxisOptions;

  //----------------------------------------------------------------
  // Computed Properties
  //------------------------------------------------------------
  $: scenario = form.scenario;
  $: chartType = form.chartType;
  $: xAxis = form.xAxis;

  $: isReady = benchmarks && statProperties && form;

  $: hasNodes =
    scenario.startsWith('disco') || scenario.startsWith('showtime_');
  // $: legendTitle = getLegendTitle(form, {hasNodes});

  // Axis Configuration
  $: axisConfigurations[BY_TIMESTAMP].x.type = getAxisXTimeStampType(form);
  $: axisConfigurations[BY_TIMESTAMP].x.tick.fit = form.useTimeSeries;
  $: axis = axisConfigurations[chartType];

  $: redrawKey =
    chartType || $filteredDataStore || axis || Date.now() || errors || xAxis;

  // X and Y Label
  $: if ($filteredDataStore['columns'] && axis && isReady) {
    const partials = getAxisYConfigurationPartials(form);
    Object.assign(axis.y, partials);

    axis.y.tick.format = getAxisYTickFormat(form, {
      statProperties,
      columns: $filteredDataStore['columns']
    });
    if (typeof axis.y.label !== 'string') {
      axis.y.label.text = getAxisYLabel(form, {statProperties});
    }
    if (typeof axis.x.label !== 'string') {
      axis.x.label.text = getAxisXLabel(form, {hasNodes});
    }
  }

  // $: if (isReady) {
  //   const selected = timestamps.filter(({key}) => {
  //     return selectedTimestamps.indexOf(key) !== -1;
  //   });

  // const factory = chartDataFactory();
  // const xAxisFactory = xAxisDataFactory(xAxis);

  // factory(benchmarks, selected, form).then(onLoaded).catch(onError);
  // xAxisFactory(benchmarks, selected, form);
  // .then(onLoadedXAxisOptions)
  // .catch(onError);
  // }

  $: deriveDataPointErrors(benchmarks);
  // $: console.log({$filteredDataStore});

  //----------------------------------------------------------------
  // Event Listeners
  //------------------------------------------------------------
  // function onLoadedXAxisOptions(results: ChartFactoryData) {
  //   if (!results) return;
  //   xAxisOptions = results;
  //   // console.log('LOADING XAXIS OPTIONS', {xAxisOptions});
  // }

  // function onLoaded(results: ChartFactoryData) {
  //   if (!results) return;
  //   $filteredDataStore = results;
  // }

  function onError(error: Error) {
    errorStore.onError(error);
  }

  //----------------------------------------------------------------
  // Methods
  //------------------------------------------------------------
  // $: console.log('Benchmarks Rerendered', benchmarks);
  // $: console.log('Chart Data Changed', $filteredDataStore);
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
                base: <Base>sName,
                dateTime,
                key: timestamp,
                scenario: <Scenario>sName,
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

  function getTimeKey(timestamp: string): string {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }
</script>

{#key redrawKey}
  <Chart
    {axis}
    data={$filteredDataStore}
    {form}
    errorTicks={errors}
    {selectedTimestamps}
  />
{/key}
