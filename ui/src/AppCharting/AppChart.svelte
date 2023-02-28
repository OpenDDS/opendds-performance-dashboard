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
  export let timestamps: TimestampViewModel[] = [];
  export let statProperties: StatProperties;

  $: title = [form.scenario, form.plotType, form.statName].join(' \uFF5C ');
</script>

<h2>{title}</h2>

<div class="panel container" style={`min-height: ${DEFAULT_CHART_HEIGHT}px`}>
  <svelte:component
    this={AppChartJs}
    {form}
    {selectedTimestamps}
    {benchmarks}
    {timestamps}
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
