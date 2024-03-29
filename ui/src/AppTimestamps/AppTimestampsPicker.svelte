<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import TimestampTableRow from './TimestampTableRow.svelte';
  import {MAX_TIMESTAMPS, MIN_TIMESTAMPS} from './timestamp-helpers';
  import type {BenchmarkIdentifier, TimestampViewModel} from '../types';
  import {errorStore} from '../utility/stores';

  export let timestamps: TimestampViewModel[];
  export let selected: BenchmarkIdentifier[] = [];
  export let latest: number = undefined;

  type DispatcherEvents = {
    change: BenchmarkIdentifier[];
    close: undefined;
  };
  const dispatch = createEventDispatcher<DispatcherEvents>();

  let useLatest = !isNaN(latest);

  let recentCount = Math.min(
    MAX_TIMESTAMPS,
    Math.max(latest || 0, MIN_TIMESTAMPS)
  );

  $: maxSelected = selected.length >= MAX_TIMESTAMPS;
  $: latest = useLatest ? recentCount : undefined;

  $: loadErrors = $errorStore.map(e => e.key);

  function handleChange(
    event: Event & {currentTarget: EventTarget & HTMLInputElement}
  ) {
    let value = Number(event.currentTarget.value).valueOf();
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

  const onClose = () => dispatch('close');

  function updateIndex(key: BenchmarkIdentifier, checked: boolean) {
    if (checked) selected.push(key);
    else {
      errorStore.remove(key);
      selected = selected.filter(sKey => sKey !== key);
    }
    dispatch('change', selected);
  }

  const onRowPressed = (timestamp: TimestampViewModel) => {
    useLatest = false;
    updateIndex(timestamp.key, !selected.includes(timestamp.key));
  };

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

  function onUncheckAll() {
    dispatch('change', []);
  }
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
                  bind:checked={useLatest}
                />
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
                  bind:value={recentCount}
                />
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
          hasError={loadErrors.includes(timestamp.key)}
          selected={selected.includes(timestamp.key)}
          {maxSelected}
          on:click={() => onRowPressed(timestamp)}
        />
      {/each}
    </tbody>
  </table>
</div>

<style>
  label {
    margin-bottom: 0;
  }

  .panel {
    margin-top: 2rem;
    padding: 1rem;
  }

  .row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .range-wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
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

  table {
    width: 100%;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }
</style>
