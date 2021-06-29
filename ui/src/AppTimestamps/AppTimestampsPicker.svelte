<script>
  import {createEventDispatcher} from 'svelte';
  import TimestampTableRow from './TimestampTableRow.svelte';
  import {MAX_TIMESTAMPS, MIN_TIMESTAMPS} from './timestamp-helpers';

  export let timestamps;
  export let selected = [];

  export let latest = undefined;

  let useLatest = !isNaN(latest);

  const dispatch = createEventDispatcher();

  let recentCount = Math.min(
    MAX_TIMESTAMPS,
    Math.max(latest || 0, MIN_TIMESTAMPS)
  );

  $: maxSelected = selected.length >= MAX_TIMESTAMPS;
  $: {
    if (useLatest) {
      latest = recentCount;
    } else {
      latest = undefined;
    }
  }

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

  const onRowPressed = timestamp => {
    useLatest = false;
    updateIndex(timestamp.key, !selected.includes(timestamp.key));
  };

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
            <div>
              <label class="server-recent-count" for="use-latest">
                <input
                  id="use-latest"
                  type="checkbox"
                  bind:checked={useLatest} />
                <span>Using {recentCount} Most Recent</span>
              </label>
              <div class="range-wrapper">
                <span>{MIN_TIMESTAMPS}</span>
                <input
                  disabled={!useLatest}
                  id="server-recent-count"
                  type="range"
                  min={MIN_TIMESTAMPS}
                  max={MAX_TIMESTAMPS}
                  on:change={handleChange}
                  bind:value={recentCount} />
                <span>{MAX_TIMESTAMPS}</span>
              </div>
            </div>
            <div>
              {#if !useLatest}
                <button on:click={onUncheckAll}>Uncheck All</button>
                <button on:click={onSelectAll}>Select Max</button>
              {/if}
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
    z-index: 1;
    position: sticky;
    top: 0;
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

  .range-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .range-wrapper > * {
    flex: 1;
  }
  .range-wrapper span {
    flex: 0;
  }
  .server-recent-count {
    min-width: 24ch;
    text-align: left;
  }
</style>
