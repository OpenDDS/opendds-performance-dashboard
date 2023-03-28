<script lang="ts">
  import type {
    BenchmarkIdentifier,
    Benchmarks,
    FormConfiguration,
    StatProperties,
    TimestampViewModel
  } from 'src/types';

  import AppChartC3 from './AppChartC3.svelte';
  import AppChartJs from './AppChartJs.svelte';
  import {DEFAULT_CHART_HEIGHT} from './chart-layout-helpers';

  export let form: FormConfiguration;
  export let selectedTimestamps: BenchmarkIdentifier[];

  export let benchmarks: Benchmarks = {};
  export let statProperties: StatProperties;

  $: legentTitle =
    form.base !== 'showtime_mixed' && form.baseScenario
      ? `${form.base}-${form.baseScenario}`
      : form.base;

  $: title = [legentTitle, form.plotType, form.statName].join(' \uFF5C ');
</script>

<h2>{title}</h2>

<div class="panel container" style={`min-height: ${DEFAULT_CHART_HEIGHT}px`}>
  <svelte:component
    this={AppChartJs}
    {form}
    {selectedTimestamps}
    {benchmarks}
    {statProperties}
  />
  <slot name="accessory" />
</div>

<style>
  .container {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
  }

  h2 {
    min-height: 1.5em;
    text-align: center;
  }
</style>
