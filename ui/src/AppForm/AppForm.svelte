<script lang="ts">
  import Select from '../components/Select.svelte';
  import {
    BY_TIMESTAMP,
    getConfigOptions,
    getConfigs
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
    ConfigOptions
  } from '../types';

  export let options: FormSelectOptions;
  export let form: FormConfiguration;
  export let timestamps;

  let baseScenarioOpts: BaseScenario[];
  let scenarioOpts: FormScenarioOptions;
  let serverCounts: number[] = [];
  let configOptions: Array<ConfigOptions> = [];
  let shallowCopy: Array<ConfigOptions> = [];
  let dataFiltered: boolean = false;

  $: if (form.base && $filteredDataStore['columns']) {
    filterOptionsByBase(form.base);
    console.log('FILTER OPTIONS BY BASE', $filteredDataStore);
  }
  $: if (dataFiltered && configOptions.length > 1) {
    form.xAxis = configOptions[0];
    form.legend = configOptions[1];
    console.log('SETTING FORM.XAXIS AND FORM.LEGEND', {configOptions});
  }
  $: {
    if (configOptions.length && form.base) {
      shallowCopy = configOptions.slice();
      let xIndex = configOptions.indexOf(form.xAxis);
      let lIndex = configOptions.indexOf(form.legend);
      let IndexesToBeRemoved = [xIndex, lIndex];
      console.log('SETTING SHALLOW COPY');
      while (IndexesToBeRemoved.length) {
        shallowCopy.splice(IndexesToBeRemoved.pop(), 1);
      }
    }
  }
  $: baseScenarioOpts = options.baseScenarios || null;
  $: showConfigOption = shallowCopy.includes('Config');
  $: showServerCount = shallowCopy.includes('Servers');
  $: showTimestampOption = shallowCopy.includes('Timestamp');
  $: scenarioOpts = options.scenarios[form.scenario] || {
    serverCounts: []
  };
  $: {
    serverCounts = Array.isArray(scenarioOpts.serverCounts)
      ? scenarioOpts.serverCounts
      : [];
    if (serverCounts.length && serverCounts.indexOf(form.serverCount) === -1) {
      form.serverCount === serverCounts[0];
    }
  }
  $: console.log({shallowCopy, configOptions, scenarioOpts});

  $: form.xAxis === 'Timestamp'
    ? (form.useTimeSeries = true)
    : (form.useTimeSeries = false);

  $: if (form.base) setScenario();

  function setScenario() {
    if (form.base.startsWith('showtime')) {
      form.scenario = <Scenario>form.base;
      return;
    }
    form.scenario = <Scenario>`${form.base}-${form.baseScenario}`;
  }

  function filterOptionsByConfig(config) {
    if (dataFiltered) {
      filteredDataStore.update(store => {
        if (store && store['columns']) {
          store['columns'].forEach(obj => {
            const key = Object.keys(obj)[0];
            let data = obj[key];
            obj[key] = data.filter(d => d.config === config);
          });
          console.log('FILTERING BY CONFIG', {store});
          return store;
        }
      });
    }
  }

  function filterOptionsByBase(base) {
    if ($filteredDataStore['columns']) {
      filteredDataStore.update(store => {
        if (store && store['columns']) {
          store['columns'].forEach(obj => {
            const key = Object.keys(obj)[0];
            let data = obj[key];
            obj[key] = data.filter(d => d.base === base);
          });
          return store;
        }
      });
      dataFiltered = true;
      // if (form.serverCount) filterByServers(form.serverCount);
      configOptions = getConfigOptions($filteredDataStore);
      options.configOptions = configOptions;
      options.baseScenarios = getConfigs($filteredDataStore);
      if (form.baseScenario) filterOptionsByConfig(form.baseScenario);
      // if (!configOptions.includes('Servers')) form.serverCount = null;
      // if (configOptions.includes('Servers') && form.serverCount) {
      //   filteredDataStore.update(store => {
      //     if (store && store['columns']) {
      //       store['columns'].forEach(obj => {
      //         const key = Object.keys(obj)[0];
      //         let data = obj[key];
      //         // obj[key] = data.filter(d => d.base === base);
      //         obj[key] = data.filter(d => {
      //           return (
      //             d.data['scenario_parameters'].Servers === form.serverCount
      //           );
      //         });
      //       });
      //       return store;
      //     }
      //   });
      // }
      // TODO: need to update form.xAxis and form.legend on base change
      // infinite loop
      // form.xAxis = configOptions[0];
      // form.legend = configOptions[1];
    }
  }

  // function filterByServers(serverCount) {
  //   filteredDataStore.update(store => {
  //     if (store && store['columns']) {
  //       store['columns'].forEach(obj => {
  //         const key = Object.keys(obj)[0];
  //         let data = obj[key];
  //         obj[key] = data.filter(
  //           d =>
  //             Object.values(d.data['scenario_parameters'].Servers) ===
  //             serverCount
  //         );
  //       });
  //       console.log({store});

  //       return store;
  //     }
  //   });
  // }

  $: console.log({form});

  // $: options.baseScenarios = getConfigs($filteredDataStore);

  // TODO: write array shift function

  async function baseChanged(event: Event) {
    form.base = <Base>(<HTMLInputElement>event.target).value;
    filterOptionsByBase(form.base);
    setScenario();
    if (form.statName === <StatName>MDTD) form.statName = DEFAULT_STAT_NAME;
  }

  function configChanged(event: Event) {
    form.baseScenario = <BaseScenario>(<HTMLInputElement>event.target).value;
    filterOptionsByConfig(form.baseScenario);
  }

  function serverChanged(event: Event) {
    let val = parseInt(<BaseScenario>(<HTMLInputElement>event.target).value);
    form.serverCount = val;
  }

  function legendChanged(event: Event) {
    if (form.xAxis === <ConfigOptions>(<HTMLInputElement>event.target).value) {
      let index = configOptions.indexOf(form.xAxis);
      if (configOptions[index + 1]! > configOptions.length) {
        form.xAxis = configOptions[index + 1];
      } else if (configOptions[index - 1] !== undefined)
        form.xAxis = configOptions[index - 1];
      else form.xAxis = configOptions[configOptions.length - 1];
    }
    form.legend = <ConfigOptions>(<HTMLInputElement>event.target).value;
  }

  function xAxisChanged(event: Event) {
    if (form.legend === <ConfigOptions>(<HTMLInputElement>event.target).value) {
      let index = configOptions.indexOf(form.legend);
      if (configOptions[index + 1]! > configOptions.length) {
        form.legend = configOptions[index + 1];
      } else if (configOptions[index - 1] !== undefined) {
        form.legend = configOptions[index - 1];
      } else form.legend = configOptions[configOptions.length - 1];
    }
    form.xAxis = <ConfigOptions>(<HTMLInputElement>event.target).value;
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
      options={options.configOptions}
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
      options={options.configOptions}
      value={form.legend}
    />
    <!-- {#each shallowCopy as option} -->
    {#if showConfigOption}
      <Select
        label="Config"
        disabled={!baseScenarioOpts.length}
        on:change={configChanged}
        options={baseScenarioOpts}
        value={form.baseScenario}
      />
    {/if}

    {#if showServerCount}
      <Select
        disabled={!serverCounts.length}
        label="# of Servers"
        on:change={serverChanged}
        options={serverCounts}
      />
    {/if}
    {#if showTimestampOption}
      <Select label="Timestamp" options={timestamps} value={form.serverCount} />
    {/if}
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
