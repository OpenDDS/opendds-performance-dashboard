<script>
  import {createEventDispatcher} from 'svelte';

  export let timestamps;

  const MAX_RECENT_COUNT = 10;
  const MAX_TIMESTAMPS = 10;
  const MIN_TIMESTAMPS = 2;
  const dispatch = createEventDispatcher();

  let recentCount = 5;

  function handleChange(event) {
    let {value} = event.target;
    if (value < MIN_TIMESTAMPS) value = MIN_TIMESTAMPS;
    if (value > MAX_TIMESTAMPS) value = MAX_TIMESTAMPS;
    recentCount = value;

    const firstSelectedIndex = timestamps.length - recentCount;
    timestamps.forEach((timestamp, index) => {
      timestamp.selected = index >= firstSelectedIndex;
    });
    timestamps = timestamps;
  }

  function handleCheck(event, index) {
    const {checked} = event.target;
    timestamps[index].selected = checked;
    timestamps = timestamps;
  }
</script>

<h2>Select the timestamps to plot.</h2>

<label>
  # of Recent Tests <input type="number" min="2" max={MAX_RECENT_COUNT} value={recentCount} on:change={handleChange} />
</label>

{#each timestamps as timestamp, index}
  <div class="row">
    <!-- <input type="checkbox" bind:checked={timestamps[index].selected} /> -->
    <input
      type="checkbox"
      checked={timestamp.selected}
      on:input={e => handleCheck(e, index)} />
    <span class="date">{timestamp.date}</span>
    <span class="time">{timestamp.time}</span>
    <span class="hash">{timestamp.hash}</span>
    {#if timestamp.errorCount}
      <span class="error-count">Errors: {timestamp.errorCount}</span>
    {/if}
  </div>
{/each}

<button on:click={() => dispatch('close')}>Close</button>

<style>
  button {
    margin-top: 1rem;
  }

  .date {
    color: var(--oci-blue);
  }

  .error-count {
    color: red;
  }

  .hash {
    color: green;
  }

  input[type='checkbox'] {
    --size: 1rem;
    height: var(--size);
    width: var(--size);
  }

  .row {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .row > span {
    margin-right: 1rem;
  }

  .time {
    color: gray;
  }
</style>
