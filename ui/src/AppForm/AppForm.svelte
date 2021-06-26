<script context="module">
</script>

<script>
  import Select from '../Select.svelte';
  import {BY_TIMESTAMP} from '../AppCharting/chart-data-extractor';
  import {CHART_TYPES, DEFAULT_STAT_NAME, MDTD} from './form-data-helpers';

  export let options;
  export let form;

  let serverCounts = [];
  $: {
    serverCounts = options.serverCountMap[form.scenario] || [];
    if (serverCounts.length && serverCounts.indexOf(form.serverCount) === -1) {
      console.log({serverCounts, sc: form.serverCount});
      form.serverCount === serverCounts[0];
    }
  }

  let plotTypes = [];
  $: {
    plotTypes = form.scenario.startsWith('showtime_')
      ? options.allPlotTypes.filter(st => !st.startsWith('Round Trip'))
      : form.scenario === 'disco'
      ? options.allPlotTypes.filter(st => !st.includes('Latency'))
      : options.allPlotTypes;

    if (plotTypes.length && !plotTypes.includes(form.plotType))
      form.plotType = plotTypes[0];
  }

  function scenarioChanged(event) {
    form.scenario = event.target.value;
    if (form.statName === MDTD) form.statName = DEFAULT_STAT_NAME;
  }
</script>

<form>
  <div class="row">
    <Select
      label="Scenario"
      on:blur={scenarioChanged}
      on:change={scenarioChanged}
      options={options.scenarios}
      value={form.scenario} />

    <Select
      label="Chart Type"
      options={CHART_TYPES}
      bind:value={form.chartType} />

    {#if form.plotType}
      <Select label="Plot" options={plotTypes} bind:value={form.plotType} />
    {/if}

    <Select
      label="Statistic"
      options={options.statNames}
      bind:value={form.statName} />

    <Select
      disabled={!serverCounts.length}
      label="# of Servers"
      options={serverCounts}
      bind:value={form.serverCount} />
  </div>
  <div>
    <label>
      <input type="checkbox" bind:checked={form.useLogScale} /> Log Scale for Y Axis
    </label>

    <label class:disabled={form.chartType !== BY_TIMESTAMP}><input
        type="checkbox"
        bind:checked={form.useTimeSeries} /> Space X values by time
    </label>
  </div>
</form>

<style>
  .row > :global(*) {
    flex: 1;
  }

  form :global(select) {
    width: 100%;
    min-width: 10rem;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  form .row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  form > div {
    margin-bottom: 1rem;
  }
</style>
