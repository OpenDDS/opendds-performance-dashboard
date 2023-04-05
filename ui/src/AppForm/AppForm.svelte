<script lang="ts">
  import Select from '../components/Select.svelte';
  import {
    BY_TIMESTAMP,
    getConfigOptions,
    getConfigs,
    classNameFromBenchmarkKey
  } from '../AppCharting/chart-data-extractor';
  import {DEFAULT_STAT_NAME, MDTD} from './form-data-helpers';
  import {filteredDataStore} from '../utility/stores';
  import type {
    Base,
    BaseConfig,
    FormConfiguration,
    FormScenarioOptions,
    FormSelectOptions,
    Scenario,
    StatName,
    ConfigOptions,
    BenchmarkIdentifier
  } from '../types';

  export let options: FormSelectOptions;
  export let form: FormConfiguration;
  export let timestamps: BenchmarkIdentifier[];

  let baseScenarioOpts: BaseConfig[];
  let scenarioOpts: FormScenarioOptions;
  let serverCounts: number[] | string[] = [];
  let configOptions: Array<ConfigOptions> = [];
  let shallowCopy: Array<ConfigOptions> = [];

  $: if (form.base && $filteredDataStore && $filteredDataStore['columns']) {
    filterOptionsByBase(form.base);
  }
  // update the form options when the data store is updated
  // $: if (configOptions.length > 1) {
  //   form.xAxis = configOptions[0];
  //   form.legend = configOptions[1];
  //   console.log('SETTING FORM.XAXIS AND FORM.LEGEND', {configOptions});
  // }
  $: {
    if (configOptions.length && form.xAxis && form.legend) {
      shallowCopy = configOptions.slice();
      let xIndex = shallowCopy.indexOf(form.xAxis);
      // let indexesToBeRemoved = [xIndex, lIndex];
      // console.log('SETTING SHALLOW COPY', {configOptions, indexesToBeRemoved});
      shallowCopy.splice(xIndex, 1);
      let lIndex = shallowCopy.indexOf(form.legend);
      shallowCopy.splice(lIndex, 1);
      // while (indexesToBeRemoved.length) {
      //   shallowCopy.splice(indexesToBeRemoved.pop(), 1);
      // }
    }
  }
  $: baseScenarioOpts = options.baseConfigs || null;
  $: formattedTimestamps = timestamps.map(t => classNameFromBenchmarkKey(t));
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
  $: console.log({shallowCopy, configOptions, serverCounts});

  $: form.xAxis === 'Timestamp'
    ? (form.useTimeSeries = true)
    : (form.useTimeSeries = false);

  $: if (form.base) setScenario();

  function setScenario() {
    if (form.base.startsWith('showtime')) {
      form.scenario = <Scenario>form.base;
      return;
    }
    form.scenario = <Scenario>(
      `${form.base}-${
        form.baseConfig ? form.baseConfig : options.baseConfigs[0]
      }`
    );
  }

  // function filterOptionsByServerCount(servers) {
  //   if (baseFiltered && configFiltered) {
  //     // TODO: make function for this store update
  //     console.log({baseFiltered, configFiltered}, form.serverCount);
  //     filteredDataStore.update(store => {
  //       if (store && store['columns']) {
  //         store['columns'].forEach(obj => {
  //           const key = Object.keys(obj)[0];
  //           let data = obj[key];
  //           obj[key] = data.filter(d => d.config === form.baseConfig);
  //           console.log('OBJ', obj[key]);
  //           obj[key] = data.filter(
  //             d => d.data['scenario_parameters'].Servers === servers
  //           );
  //         });
  //         console.log('FILTERING BY Servers', {store});
  //         return store;
  //       }
  //     });
  //   }
  // }

  // function filterOptionsByConfig(config) {
  //   if (baseFiltered) {
  //     filteredDataStore.update(store => {
  //       if (store && store['columns']) {
  //         store['columns'].forEach(obj => {
  //           const key = Object.keys(obj)[0];
  //           let data = obj[key];
  //           obj[key] = data.filter(d => d.config === config);
  //         });
  //         console.log('FILTERING BY CONFIG', {store});
  //         return store;
  //       }
  //     });
  //     configFiltered = true;
  //   }
  // }

  // function filterByTimestamp() {
  //   console.log('FIRST', $filteredDataStore);

  //   let newStore = [];
  //   filteredDataStore.update(store => {
  //     if (store && store['columns']) {
  //       store['columns'].forEach(obj => {
  //         console.log('OBJ', Object.keys(obj)[0] === form.timestamp);
  //         // const key = Object.keys(obj)[0];
  //         if (Object.keys(obj)[0] === form.timestamp) newStore.push(obj);
  //       });
  //       // console.log('STORE', store['columns']);
  //     }
  //     store = newStore;
  //     return store;
  //   });
  //   console.log('second', $filteredDataStore);
  //   console.log({newStore});
  // }

  function filterOptionsByBase(base) {
    if ($filteredDataStore['columns']) {
      console.log('FILTER OPTIONS BY BASE', $filteredDataStore, {base});
      let newStore = [];
      filteredDataStore.update(store => {
        if (store && store['columns']) {
          if (form.timestamp) {
            store['columns'].forEach(obj => {
              if (Object.keys(obj)[0] === form.timestamp) newStore.push(obj);
              // console.log(
              //   'FILTER OPTIONS TIMESTAMP',
              //   $filteredDataStore,
              //   form.timestamp
              // );
            });
            store['columns'] = newStore;
          }
          store['columns'].forEach(obj => {
            const key = Object.keys(obj)[0];
            let data = obj[key];
            obj[key] = data.filter(d => d.base === base);
            options.baseConfigs = getConfigs($filteredDataStore);
            configOptions = getConfigOptions($filteredDataStore);
            options.configOptions = configOptions;
            if (form.baseConfig && form.serverCount) {
              obj[key] = data.filter(
                d =>
                  d.base === base &&
                  d.config === form.baseConfig &&
                  d.data['scenario_parameters'].Servers === form.serverCount
              );
              // console.log('Filtering config, serverCount, and base');
            } else if (form.baseConfig) {
              // console.log('Filtering config, base');
              obj[key] = data.filter(
                d => d.base === base && d.config === form.baseConfig
              );
            }
          });
          return store;
        }
      });
      // baseFiltered = true;
    }
  }

  $: console.log({form, options});

  // TODO: write array shift function

  async function baseChanged(event: Event) {
    form.base = <Base>(<HTMLInputElement>event.target).value;
    form.baseConfig = null;
    form.serverCount = null;
    setScenario();
    if (form.statName === <StatName>MDTD) form.statName = DEFAULT_STAT_NAME;
  }

  function configChanged(event: Event) {
    let config = <BaseConfig>(<HTMLInputElement>event.target).value;
    // filterOptionsByConfig(val);
    form.baseConfig = config;
  }

  function serverChanged(event: Event) {
    let server = parseInt(<BaseConfig>(<HTMLInputElement>event.target).value);
    // filterOptionsByServerCount(form.serverCount);
    form.serverCount = server;
  }

  function timestampChanged(event: Event) {
    form.timestamp = <BenchmarkIdentifier>(
      (<HTMLInputElement>event.target).value
    );
  }

  function legendChanged(event: Event) {
    const legend = <ConfigOptions>(<HTMLInputElement>event.target).value;
    if (legend === 'Servers') form.serverCount = null;
    if (legend === 'Config') form.baseConfig = null;
    if (legend === 'Timestamp') form.timestamp = null;
    if (form.xAxis === legend) {
      let index = configOptions.indexOf(form.xAxis);
      if (configOptions[index + 1]! > configOptions.length) {
        form.xAxis = configOptions[index + 1];
      } else if (configOptions[index - 1] !== undefined)
        form.xAxis = configOptions[index - 1];
      else form.xAxis = configOptions[configOptions.length - 1];
    }
    form.legend = legend;
  }

  function xAxisChanged(event: Event) {
    // TODO: clean this up
    const xAxis = <ConfigOptions>(<HTMLInputElement>event.target).value;
    if (xAxis === 'Config') form.baseConfig = null;
    if (xAxis === 'Servers') form.serverCount = null;
    if (xAxis === 'Timestamp') form.timestamp = null;
    if (form.legend === xAxis) {
      let index = configOptions.indexOf(form.legend);
      if (configOptions[index + 1]! > configOptions.length) {
        form.legend = configOptions[index + 1];
      } else if (configOptions[index - 1] !== undefined) {
        form.legend = configOptions[index - 1];
      } else form.legend = configOptions[configOptions.length - 1];
    }
    form.xAxis = xAxis;
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
    <!-- {#each shallowCopy as option}
      <Select label={option} />
      on:change={option.onchange}
        options={option.options}
        value={option.value}
    {/each} -->
    {#if showConfigOption}
      <Select
        label="Config"
        disabled={!baseScenarioOpts.length}
        on:change={configChanged}
        options={baseScenarioOpts}
        value={form.baseConfig}
      />
    {/if}

    {#if showServerCount}
      <Select
        disabled={!serverCounts.length}
        label="# of Servers"
        on:change={serverChanged}
        options={serverCounts}
        value={form.serverCount}
      />
    {/if}
    {#if showTimestampOption}
      <Select
        label="Timestamp"
        on:change={timestampChanged}
        options={formattedTimestamps}
        value={form.timestamp}
      />
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
