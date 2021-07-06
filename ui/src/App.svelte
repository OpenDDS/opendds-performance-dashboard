<script lang="ts">
  import {onMount} from 'svelte';
  import OpenDDSLogo from './components/OpenDDSLogo.svelte';
  import {
    dataStore,
    getGitTags,
    getStatProperties,
    getRunIndex,
    errorStore
  } from './utility/data-loader';
  import {deriveSelectOptionsFromData} from './AppForm/form-data-helpers';
  import AppForm from './AppForm/AppForm.svelte';
  import {
    DEFAULT_CHART_TYPE,
    DEFAULT_PLOT_TYPE,
    DEFAULT_RECENT_COUNT,
    DEFAULT_SCENARIO,
    DEFAULT_STAT_NAME,
    DEFAULT_SERVER_COUNT
  } from './AppForm/form-data-helpers';

  import AppChart from './AppCharting/AppChart.svelte';
  import AppErrorView from './AppErrorView.svelte';
  import AppTimestampsPicker from './AppTimestamps/AppTimestampsPicker.svelte';

  import {
    configureEmbedding,
    getValidatedInitialData,
    updateBrowserHistory
  } from './AppSharing/share-data';
  import AppSharing from './AppSharing/AppSharing.svelte';
  import type {FormConfiguration, FormSelectOptions, Scenario} from './types';

  export let initialData = {};
  const {isEmbedded} = configureEmbedding(initialData);

  // The segment of data based on
  // The selected timestamps / $collectedData
  let benchmarks = {};

  let form: FormConfiguration = {
    scenario: DEFAULT_SCENARIO,
    statName: DEFAULT_STAT_NAME,
    plotType: DEFAULT_PLOT_TYPE,
    serverCount: DEFAULT_SERVER_COUNT,
    chartType: DEFAULT_CHART_TYPE,
    useTimeSeries: false,
    useLogScale: false,
    selectedTimestamps: [],
    latest: undefined
  };

  // Chart Related Properties
  let selectOptions: FormSelectOptions = {
    scenarios: [],
    allPlotTypes: [],
    statNames: [],
    serverCountMap: <Record<Scenario, number[]>>{[form.scenario]: []}
  };

  let selectingTimestamps = false;
  let selectedTimestamps = [];
  let serverCounts = [];
  let statProperties;
  let timestamps = [];

  //-------------------------------------------------------------------------------
  // Computed
  //--------------------------------------------------------------------
  $: scenario = form.scenario;
  $: serverCount = form.serverCount;
  $: serverCountMap = selectOptions.serverCountMap;

  $: isReady = statProperties && timestamps.length > 0;

  $: {
    // form.selectedTimestamps = selectedTimestamps;
  }
  //-------------------------------------------------------------------------------
  // Observed
  //--------------------------------------------------------------------
  $: {
    console.log({isReady});
  }

  $: {
    console.log({selectedTimestamps});
  }

  $: if (isReady) {
    loadBenchmarks(selectedTimestamps);
  }

  $: {
    updateBrowserHistory(
      {
        ...form,
        ...selectedTimestamps
      },
      !isEmbedded
    );
  }

  // We'll only re-render the chart once the
  // timestamp picker is closed.
  $: if (!selectingTimestamps) {
    benchmarks = Object.entries($dataStore).reduce((acc, [key, dataSet]) => {
      if (selectedTimestamps.includes(key)) {
        acc[key] = dataSet;
      }
      return acc;
    }, {});
  }

  $: if (isReady) {
    serverCounts = serverCountMap[scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(serverCount) === -1) {
      serverCount === serverCounts[0];
    }
  }

  //-------------------------------------------------------------------------------
  //  Lifecycle Methods
  //--------------------------------------------------------------------
  onMount(initialize);

  //-------------------------------------------------------------------------------
  //  Methods
  //-------------------------------------------------------------------------------
  async function initialize() {
    try {
      const [loadedstats, loadedtimestamps] = await Promise.all([
        getStatProperties(),
        loadTimestamps()
      ]);

      statProperties = loadedstats;
      timestamps = loadedtimestamps;
      const {error, validated} = getValidatedInitialData({
        initialData,
        timestamps,
        defaultCount: DEFAULT_RECENT_COUNT
      });
      form = {...form, ...validated};
      selectedTimestamps = form.selectedTimestamps;
      if (error) throw new Error(error);
    } catch (error) {
      onError(error);
    }
  }

  function onError(error: Error) {
    errorStore.onError(error);
  }

  async function loadBenchmarks(ids = []) {
    try {
      const {results} = await dataStore.loadBenchmarks(ids);
      selectOptions = deriveSelectOptionsFromData(results);
    } catch (error) {
      onError(error);
    }
  }

  async function loadTimestamps() {
    const timestamps = await getRunIndex();
    const gitHubTags = await getGitTags();
    const viewModelMapper = timeStampViewModelFactory({gitHubTags});
    return viewModelMapper(timestamps);
  }

  const timeStampViewModelFactory = ({gitHubTags}) => {
    const keyedTags = gitHubTags.reduce((acc, tag) => {
      acc[tag.commit.sha] = tag;
      return acc;
    }, {});

    return function map(timestamps) {
      return timestamps.map(
        ({key, commit, date: dateTime, hash, errors: errorCount}) => {
          const [date, timePlus] = dateTime.split('T');
          const [time] = timePlus.split('+');
          return {
            key,
            date,
            time,
            dateTime: date + ' ' + time,
            errorCount,
            commit,
            hash,
            tag: keyedTags[commit]
          };
        }
      );
    };
  };
</script>

<main>
  {#if !isEmbedded}
    <header class="row">
      <div>
        <a
          href="https://opendds.org"
          alt="Go to the OpenDDS website"
          class="panel"
        >
          <OpenDDSLogo />
        </a>
      </div>

      <div class="right">
        <h1 class="title">Bench Scoreboard</h1>
        <div class="buttons">
          <AppSharing />
          <button
            type="button"
            on:click={() => (selectingTimestamps = !selectingTimestamps)}
          >
            {selectingTimestamps ? 'Hide Timestamps' : 'Show Timestamps'}
          </button>
        </div>
      </div>
    </header>
  {/if}

  {#if selectingTimestamps}
    <AppTimestampsPicker
      {timestamps}
      bind:latest={form.latest}
      selected={selectedTimestamps}
      on:change={({detail}) => {
        selectedTimestamps = detail;
      }}
      on:close={() => (selectingTimestamps = false)}
    />
  {:else}
    {#if !isEmbedded}
      <div class="row">
        <AppForm bind:form options={selectOptions} />
      </div>
    {/if}

    <AppChart {benchmarks} {form} {statProperties} {timestamps}>
      <AppErrorView slot="accessory" />
    </AppChart>
  {/if}
</main>

<style>
  main {
    max-width: 1000px;
    margin: auto;
    padding-bottom: 4rem;
  }

  header {
    padding: 1rem 0;
  }

  header h1 {
    margin-top: 0;
    text-align: center;
  }
  header .right {
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
  }

  .panel {
    padding: 1rem;
    display: block;
    width: max-content;
  }

  header .panel > :global(svg) {
    width: 15rem;
    object-fit: contain;
  }

  .right button {
    min-width: 20ch;
    margin-left: 1rem;
  }

  .right .buttons {
    display: flex;
  }

  .right .buttons :global(.sharing) {
    z-index: 2;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
  }
  .row > div {
    flex: 1;
  }

  .row > :global(.sharing) {
    margin-top: 1rem;
  }
</style>
