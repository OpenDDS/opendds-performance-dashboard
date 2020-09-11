<script>
  import {createEventDispatcher} from 'svelte';

  export let timestamps;

  const dispatch = createEventDispatcher();

  function handleInput(event, index) {
    const {checked} = event.target;
    timestamps[index].selected = checked;
    timestamps = timestamps;
  }
</script>

<h2>Select the timestamps to plot.</h2>

{#each timestamps as timestamp, index}
  <div class="row">
    <!-- <input type="checkbox" bind:checked={timestamps[index].selected} /> -->
    <input
      type="checkbox"
      checked={timestamp.selected}
      on:input={e => handleInput(e, index)} />
    <span class="date">{timestamp.date}</span>&nbsp; <span
      class="time">{timestamp.time}</span>&nbsp; <span
      class="hash">{timestamp.hash}</span>
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

  .hash {
    color: gray;
  }

  input {
    --size: 1rem;
    height: var(--size);
    width: var(--size);
  }

  .row {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .time {
    color: black;
  }
</style>
