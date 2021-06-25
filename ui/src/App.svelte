<script>
  import {onMount} from 'svelte';
  import TimestampSelection from './TimestampSelection.svelte';
  import {dataStore, getStatProperties, getTimestamps} from './data-loader';
  import {chartDataFactory} from './AppCharting/chart-data-extractor';

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
    generateShareLink
  } from './share-data';

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
  let chartData = {columns: [], x: 'x'};
  $: chartType = form.chartType;

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

  $: statName = form.statName;
  let statProperties;

  $: plotType = form.plotType;

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
    generateShareLink(form);
  }

  $: if (isReady) {
    const selected = timestamps.filter(({key}) => {
      return selectedTimestamps.indexOf(key) !== -1;
    });
    const opts = {
      timestamps: selected,
      scenario,
      serverCount,
      plotType,
      statName
    };
    const factory = chartDataFactory(chartType);
    factory(benchmarks, opts).then(results => {
      if (!results) return;
      chartData = results;
    });
  }

  $: if (isReady) {
    serverCounts = serverCountMap[scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(serverCount) === -1) {
      serverCount === serverCounts[0];
    }
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

  function mapTimestampsToViewModel(timestamps) {
    return timestamps.map(
      ({key, commit, date: dateTime, hash, errors: errorCount}) => {
        const [date, timePlus] = dateTime.split('T');
        const [time] = timePlus.split('+');

        return {
          key,
          date,
          time,
          dateTime: date + ' ' + time,
          full: key,
          errorCount,
          commit,
          hash
        };
      }
    );
  }

  async function loadTimestamps() {
    const timestamps = await getTimestamps();
    return mapTimestampsToViewModel(timestamps);
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
  <header class="row">
    <h1 class="title">OpenDDS Bench Scoreboard</h1>

    <div class="right">
      <button
        type="button"
        on:click={() => (selectingTimestamps = !selectingTimestamps)}>
        {selectingTimestamps ? 'Close Timestamp Picker' : 'Select Timestamps'}
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
    <div class="row">
      <AppForm bind:form options={selectOptions} />
    </div>

    <AppChart {form} {chartData} {statProperties} {errors} />
    <!-- <LineChart
      {axis}
      data={chartData}
      {legendTitle}
      {title}
      on:rendered={styleSpecialPoints} /> -->
  {/if}
</main>

<style>
  main {
    max-width: 1000px;
    margin: auto;
  }

  header {
    align-items: center;
  }
  header .right {
    flex: 0;
    width: max-content;
  }

  .row {
    display: flex;
  }
  .row > * {
    flex: 1;
  }
</style>
