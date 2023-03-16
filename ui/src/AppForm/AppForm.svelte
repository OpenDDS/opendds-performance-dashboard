<script lang="ts">
  import Select from '../components/Select.svelte';
  import {
    BY_TIMESTAMP,
    getConfigOptions,
    getXAxisAndLegendOptions
  } from '../AppCharting/chart-data-extractor';
  import {DEFAULT_STAT_NAME, MDTD} from './form-data-helpers';
  import {filteredDataStore} from '../utility/stores';
  import type {
    Base,
    BaseScenario,
    FormConfiguration,
    FormScenarioOptions,
    FormSelectOptions,
    Scenario,
    StatName,
    XAxisAndLegendOptions
  } from '../types';

  export let options: FormSelectOptions;
  export let form: FormConfiguration;

  let baseScenarioOpts;
  let scenarioOpts: FormScenarioOptions;
  let serverCounts: number[] = [];
  let xAxisOptions: XAxisAndLegendOptions[];

  $: baseScenarioOpts = options?.bases[form.base]?.baseScenarios || [];
  $: scenarioOpts = options.scenarios[form.scenario] || {
    serverCounts: []
  };
  $: xAxisOptions = options.xAxisOptions;
  $: {
    serverCounts = Array.isArray(scenarioOpts.serverCounts)
      ? scenarioOpts.serverCounts
      : [];
    if (serverCounts.length && serverCounts.indexOf(form.serverCount) === -1) {
      form.serverCount === serverCounts[0];
    }
  }

  function setScenario() {
    if (form.base.startsWith('showtime')) {
      form.scenario = <Scenario>form.base;
      return;
    }
    form.scenario = <Scenario>`${form.base}-${form.baseScenario}`;
  }

  export function filterOptionsByBase(base) {
    filteredDataStore.update(store => {
      console.log({store});
      store.columns.forEach(obj => {
        const key = Object.keys(obj)[0];
        let data = obj[key];
        obj[key] = data.filter(d => d.base === base);
      });
      return store;
    });
  }

  // TODO: write array shift function
  // function shiftOptionsArray(array: any[], value: string) {
  //   let index = array.indexOf(value);
  //   console.log({index, array, value});
  //   // shiftOptionsArray(options.legendOptions, form.legend)
  //   array.splice(index, 1);
  //   array.splice(0, 0, form[value]);
  //   form[value] = array[index];
  //   // let index = options.legendOptions.indexOf(form.legend);
  //   //   options.legendOptions.splice(index, 1);
  //   //   options.legendOptions.splice(0, 0, form.legend);
  //   //   form.legend = options.legendOptions[index];
  // }
  $: console.log({form, options});

  function baseChanged(event: Event) {
    filterOptionsByBase(<Base>(<HTMLInputElement>event.target).value);
    form.base = <Base>(<HTMLInputElement>event.target).value;

    let xAxisAndLegendOptions = getXAxisAndLegendOptions($filteredDataStore);
    let configOptions = getConfigOptions($filteredDataStore);
    options.xAxisOptions = xAxisAndLegendOptions;
    options.legendOptions = xAxisAndLegendOptions;
    options.baseScenarios = configOptions;
    form.xAxis = xAxisAndLegendOptions[0];
    form.legend = xAxisAndLegendOptions[1];
    form.baseScenario = configOptions[0];
    console.log('BASECHANGED', {xAxisAndLegendOptions, configOptions});
    setScenario();
    if (form.statName === <StatName>MDTD) form.statName = DEFAULT_STAT_NAME;
  }

  function configChanged(event: Event) {
    form.baseScenario = <BaseScenario>(<HTMLInputElement>event.target).value;
  }

  function legendChanged(event: Event) {
    if (
      form.xAxis ===
      <XAxisAndLegendOptions>(<HTMLInputElement>event.target).value
    ) {
      let index = options.xAxisOptions.indexOf(form.xAxis);
      if (options.xAxisOptions[index + 1]! > options.xAxisOptions.length) {
        form.xAxis = options.xAxisOptions[index + 1];
      } else form.xAxis = options.xAxisOptions[index - 1];
    }
    form.legend = <XAxisAndLegendOptions>(<HTMLInputElement>event.target).value;
  }

  function xAxisChanged(event: Event) {
    if (
      form.legend ===
      <XAxisAndLegendOptions>(<HTMLInputElement>event.target).value
    ) {
      let index = options.xAxisOptions.indexOf(form.legend);
      if (options.legendOptions[index + 1]! > options.xAxisOptions.length) {
        form.legend = options.xAxisOptions[index + 1];
      } else form.legend = options.xAxisOptions[index - 1];
    }
    form.xAxis = <XAxisAndLegendOptions>(<HTMLInputElement>event.target).value;
  }
</script>

<form>
  <div class="row">
    <Select
      label="Base"
      on:change={baseChanged}
      options={Object.keys(options.bases)}
      value={form.base}
    />

    <Select
      label="X-Axis"
      on:change={xAxisChanged}
      options={options.xAxisOptions}
      value={form.xAxis}
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
      label="Legend"
      on:change={legendChanged}
      options={options.legendOptions}
      value={form.legend}
    />

    <Select
      label="Config"
      on:change={configChanged}
      options={options.baseScenarios}
      value={form.baseScenario}
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
