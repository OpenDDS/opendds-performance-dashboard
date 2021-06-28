<script>
  import {onMount} from 'svelte';
  import OpenDDSLogo from './components/OpenDDSLogo.svelte';
  import TimestampSelection from './AppTimestamps/TimestampSelection.svelte';
  import {
    dataStore,
    getGitTags,
    getStatProperties,
    getRunIndex
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
  import {
    getValidatedInitialData,
    getInitialData,
    updateBrowserHistory
  } from './AppSharing/share-data';
  import AppSharing from './AppSharing/AppSharing.svelte';

  const initialData = getInitialData(window.location.search);

  // The segment of data based on
  // The selected timestamps / $collectedData
  let benchmarks = {};

  let form = {
    scenario: DEFAULT_SCENARIO,
    statName: DEFAULT_STAT_NAME,
    plotType: DEFAULT_PLOT_TYPE,
    serverCount: DEFAULT_SERVER_COUNT,
    chartType: DEFAULT_CHART_TYPE,
    useTimeSeries: false,
    useLogScale: false,
    selectedTimestamps: []
  };

  // Chart Related Properties

  let selectOptions = {
    scenarios: [],
    allPlotTypes: [],
    statNames: [],
    serverCountMap: {scenario: []}
  };

  const errors = new Map();
  let selectingTimestamps = false;

  $: scenario = form.scenario;

  $: serverCount = form.serverCount;
  $: serverCountMap = selectOptions.serverCountMap;
  let serverCounts = [];
  let statProperties;

  $: selectedTimestamps = form.selectedTimestamps;
  let timestamps = [];

  onMount(initialize);

  $: isReady = $dataStore && statProperties;

  $: {
    loadBenchmarks(selectedTimestamps);
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

  $: {
    updateBrowserHistory(form, !isEmbedded);
  }

  $: if (isReady) {
    serverCounts = serverCountMap[scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(serverCount) === -1) {
      serverCount === serverCounts[0];
    }
  }

  const {isEmbedded} = configureEmbedding(initialData);

  function configureEmbedding({embed, text_color}) {
    const isEmbedded = embed === 'iframe';
    if (embed === 'iframe') {
      document.body.classList.remove('stylized');
      document.body.classList.add('embedded');
      document.body.style.setProperty('--bg-color', 'transparent');
    }
    if (text_color) {
      document.body.style.setProperty('--text-color', text_color);
    }
    return {
      isEmbedded
    };
  }

  function getTimeKey(timestamp) {
    const dateTimeString = timestamp.split('+')[0];
    return dateTimeString.replace('T', '_');
  }

  function setSelectOptions(benchmarks) {
    selectOptions = deriveSelectOptionsFromData(benchmarks);
  }

  async function loadBenchmarks(ids = []) {
    const results = await dataStore.loadBenchmarks(ids);
    setSelectOptions(results);
    setErrors(results);
  }

  async function initialize() {
    try {
      statProperties = await getStatProperties();
      timestamps = await loadTimestamps();
      const validated = getValidatedInitialData({
        initialData,
        timestamps,
        defaultCount: DEFAULT_RECENT_COUNT
      });
      form = {...form, ...validated};
    } catch (e) {
      alert(e.message);
      console.error(e);
    }
  }

  function mapTimestampsToViewModel(timestamps, gitHubTags) {
    const keyedTags = gitHubTags.reduce((acc, tag) => {
      acc[tag.commit.sha] = tag;
      return acc;
    }, {});

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
  }

  async function loadTimestamps() {
    const timestamps = await getRunIndex();
    const gitHubTags = await getGitTags();
    return mapTimestampsToViewModel(timestamps, gitHubTags);
  }

  function setErrors(benchmarks) {
    errors.clear();
    for (const [timestamp, timeData] of Object.entries(benchmarks)) {
      const dateTime = getTimeKey(timestamp);
      for (const [scenario, scenarioData] of Object.entries(timeData)) {
        for (const [size, sizeData] of Object.entries(scenarioData)) {
          if (sizeData.Errors) {
            const id = [scenario, timestamp].join('|');
            errors.set(id, {
              key: timestamp,
              scenario,
              dateTime,
              size
            });
          }
        }
      }
    }
  }
</script>

<main>
  <header class="row" class:hidden={isEmbedded}>
    <div>
      <div class="panel">
        <OpenDDSLogo />
      </div>
    </div>

    <div class="right">
      <h1 class="title">Bench Scoreboard</h1>
      <button
        type="button"
        on:click={() => (selectingTimestamps = !selectingTimestamps)}>
        {selectingTimestamps ? 'Hide Timestamps' : 'Show Timestamps'}
      </button>
    </div>
  </header>

  {#if selectingTimestamps}
    <TimestampSelection
      {timestamps}
      selected={selectedTimestamps}
      on:change={({detail}) => {
        form.selectedTimestamps = detail;
      }}
      on:close={() => (selectingTimestamps = false)} />
  {:else}
    <div class="row" class:hidden={isEmbedded}>
      <AppForm bind:form options={selectOptions} />
    </div>

    <AppChart {form} {benchmarks} {timestamps} {statProperties} {errors} />

    <div class="row" class:hidden={isEmbedded}>
      <AppSharing />
    </div>
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

  .hidden {
    display: none !important;
  }
  .panel {
    padding: 1rem;
    width: max-content;
  }
  .panel > :global(svg) {
    width: 15rem;
    object-fit: contain;
  }

  .right button {
    min-width: 20ch;
  }

  .row {
    display: flex;
  }
  .row > div {
    flex: 1;
  }

  .row > :global(.sharing) {
    margin-top: 1rem;
  }
</style>
