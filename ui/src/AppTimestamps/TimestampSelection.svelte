<script>
  import {createEventDispatcher} from 'svelte';
  import TimestampTableRow from './TimestampTableRow.svelte';

  export let timestamps;
  export let selected = [];

  const MAX_TIMESTAMPS = 10;
  const MIN_TIMESTAMPS = 2;
  const dispatch = createEventDispatcher();

  let recentCount = 5;

  $: maxSelected = selected.length >= MAX_TIMESTAMPS;

  function handleChange(event) {
    let {value} = event.target;
    if (value < MIN_TIMESTAMPS) value = MIN_TIMESTAMPS;
    if (value > MAX_TIMESTAMPS) value = MAX_TIMESTAMPS;
    recentCount = value;

    const firstSelectedIndex = timestamps.length - recentCount;
    selected = timestamps
      .filter((_, index) => {
        return index >= firstSelectedIndex;
      })
      .map(t => t.key);
    dispatch('change', selected);
  }

  const onRowPressed = timestamp =>
    updateIndex(timestamp.key, !selected.includes(timestamp.key));

  function updateIndex(key, checked) {
    if (checked) selected.push(key);
    else {
      selected = selected.filter(sKey => sKey !== key);
    }
    dispatch('change', selected);
  }

  function onUncheckAll() {
    dispatch('change', []);
  }

  function onSelectAll() {
    const targets = timestamps.map(t => t.key);
    let idx = targets.length - MAX_TIMESTAMPS;
    if (selected.length) {
      idx = Math.min(
        targets.findIndex(t => t === selected[0]),
        targets.length - MAX_TIMESTAMPS
      );
    }
    const change = targets.slice(idx, idx + MAX_TIMESTAMPS);
    dispatch('change', change);
  }

  const onClose = () => dispatch('close');
</script>

<h2>Select the timestamps to plot.</h2>
<div class="panel">
  <table>
    <thead>
      <tr>
        <th colspan="1000">
          <div class="row">
            <label for="server-recent-count">
              <span># of Recent Tests ({recentCount})</span>
              <div style="display: flex; align-items: center;">
                {MIN_TIMESTAMPS}
                <input
                  id="server-recent-count"
                  type="range"
                  min={MIN_TIMESTAMPS}
                  max={MAX_TIMESTAMPS}
                  on:change={handleChange}
                  bind:value={recentCount} />
                {MAX_TIMESTAMPS}
              </div>
            </label>

            <div>
              <button on:click={onUncheckAll}>Uncheck All</button>
              <button on:click={onSelectAll}>Select Max</button>
              <button on:click={onClose}>Close</button>
            </div>
          </div>
        </th>
      </tr>
      <tr>
        <th>Select</th>
        <th>Date</th>
        <th>Time</th>
        <th>Git SHA</th>
        <th>Tag</th>
        <th>Build Hash</th>
        <th>#Error</th>
      </tr>
    </thead>
    <tbody>
      {#each [...timestamps].reverse() as timestamp (timestamp.key)}
        <TimestampTableRow
          {timestamp}
          selected={selected.includes(timestamp.key)}
          {maxSelected}
          on:click={() => onRowPressed(timestamp)} />
      {/each}
    </tbody>
  </table>
</div>

<style>
  label {
    margin-bottom: 0;
  }
  table {
    width: 100%;
  }

  thead {
    z-index: 99999;
    position: sticky;
    top: 0;
  }

  thead tr {
    z-index: 99999;
  }

  .panel {
    padding: 1rem;
    margin-top: 2rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }
</style>
