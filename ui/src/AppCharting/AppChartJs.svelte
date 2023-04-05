<script lang="ts">
  import {errorStore, filteredDataStore} from '../utility/stores';
  import Chart from './LineChartjs.svelte';

  import {
    axisFactory,
    getAxisYLabel,
    getAxisXLabel,
    // getAxisXTimeStampType,
    getAxisYConfigurationPartials,
    getAxisYTickFormat
  } from './chart-layout-helpers';
  import type {
    Base,
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    FormSelectOptions,
    Scenario,
    StatProperties
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
  export let statProperties: StatProperties;

  //----------------------------------------------------------------
  // Local State
  //------------------------------------------------------------
  // let axisConfigurations = axisFactory();
  let errors = new Map<BenchmarkIdentifier, ErrorEntry[]>();

  //----------------------------------------------------------------
  // Computed Properties
  //------------------------------------------------------------

  $: chartType = form.chartType;

  // $: console.log('AppChartJs', $filteredDataStore, {form});

  $: isReady = benchmarks && statProperties && form;

  // $: hasNodes =
  //   scenario.startsWith('disco') || scenario.startsWith('showtime_');

  // Axis Configuration
  $: axis = axisFactory(form.useTimeSeries);
  // $: console.log('FILTEREDDATASTORE', $filteredDataStore);

  $: redrawKey =
    chartType || $filteredDataStore || form || Date.now() || errors;

  // X and Y Label

  $: if (
    $filteredDataStore &&
    $filteredDataStore['columns'] &&
    axis &&
    isReady
  ) {
    console.log('APPCHARTJS', $filteredDataStore['columns']);
    const partials = getAxisYConfigurationPartials(form);
    // console.log({partials});

    Object.assign(axis.y, partials);

    axis.y.tick.format = getAxisYTickFormat(form, {
      statProperties,
      columns: $filteredDataStore['columns']
    });
    if (typeof axis.y.label !== 'string') {
      axis.y.label.text = getAxisYLabel(form, {statProperties});
    }
    if (typeof axis.x.label !== 'string') {
      axis.x.label.text = getAxisXLabel(form);
      // axis.x.label.text = getAxisXLabel(form, {hasNodes});
    }
  }

  $: deriveDataPointErrors(benchmarks);

  //----------------------------------------------------------------
  // Event Listeners
  //------------------------------------------------------------

  function onError(error: Error) {
    errorStore.onError(error);
  }

  //----------------------------------------------------------------
  // Methods
  //------------------------------------------------------------
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
  <Chart {axis} {form} errorTicks={errors} {selectedTimestamps} />
{/key}
