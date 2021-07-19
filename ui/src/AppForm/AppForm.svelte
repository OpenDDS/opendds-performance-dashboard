<script lang="ts">
  import Select from '../components/Select.svelte';
  import {BY_TIMESTAMP} from '../AppCharting/chart-data-extractor';
  import {CHART_TYPES, DEFAULT_STAT_NAME, MDTD} from './form-data-helpers';
  import type {
    FormConfiguration,
    FormScenarioOptions,
    FormSelectOptions,
    Scenario,
    StatName
  } from '../types';

  export let options: FormSelectOptions;
  export let form: FormConfiguration;

  let scenarioOpts: FormScenarioOptions;
  $: scenarioOpts = options.scenarios[form.scenario] || {
    serverCounts: []
  };

  let serverCounts: number[] = [];
  $: {
    serverCounts = Array.isArray(scenarioOpts.serverCounts)
      ? scenarioOpts.serverCounts
      : [];
    if (serverCounts.length && serverCounts.indexOf(form.serverCount) === -1) {
      form.serverCount === serverCounts[0];
    }
  }

  function scenarioChanged(event: Event) {
    form.scenario = <Scenario>(<HTMLInputElement>event.target).value;
    if (form.statName === <StatName>MDTD) form.statName = DEFAULT_STAT_NAME;
  }
</script>

<form>
  <div class="row">
    <Select
      label="Scenario"
      on:blur={scenarioChanged}
      on:change={scenarioChanged}
      options={Object.keys(options.scenarios)}
      value={form.scenario}
    />

    <Select
      label="Chart Type"
      options={CHART_TYPES}
      bind:value={form.chartType}
    />

    {#if form.plotType}
      <Select
        label="Plot"
        options={options.plotTypes}
        bind:value={form.plotType}
      />
    {/if}

    <Select
      label="Statistic"
      options={options.statNames}
      bind:value={form.statName}
    />

    <Select
      disabled={!serverCounts.length}
      label="# of Servers"
      options={serverCounts}
      bind:value={form.serverCount}
    />
  </div>
  <div>
    <label>
      <input type="checkbox" bind:checked={form.useLogScale} /> Log Scale for Y Axis
    </label>

    <label class:disabled={form.chartType !== BY_TIMESTAMP}
      ><input type="checkbox" bind:checked={form.useTimeSeries} /> Space X values
      by time
    </label>
  </div>
</form>

<style>
  .row > :global(*) {
    flex: 1;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

  form :global(select) {
    min-width: 10rem;
    width: 100%;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  form .row {
    display: flex;
    flex-wrap: wrap;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
  form > div {
    margin-bottom: 1rem;
  }
</style>
