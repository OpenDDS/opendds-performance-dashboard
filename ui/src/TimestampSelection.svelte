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
  <span># of Recent Tests</span>
  <input
    type="number"
    min={MIN_TIMESTAMPS}
    max={MAX_TIMESTAMPS}
    on:change={handleChange}
    value={recentCount} />
</label>

<table>
  <thead>
    <tr>
      <th>Select</th>
      <th>Date</th>
      <th>Time</th>
      <th>Git Commit Hash</th>
      <th>Build Hash</th>
      <th>Error Count</th>
    </tr>
  </thead>
  <tbody>
    {#each timestamps as timestamp, index}
      <tr>
        <td>
          <input
            type="checkbox"
            checked={timestamp.selected}
            on:input={e => handleCheck(e, index)} />
        </td>
        <td class="date">{timestamp.date}</td>
        <td class="time">{timestamp.time}</td>
        <td>
          <a
            href={timestamp.url}
            rel="noopener"
            target="_blank">{timestamp.gitCommit}</a>
        </td>
        <td class="hash">{timestamp.hash ? timestamp.hash : ''}</td>
        <td class="error-count">
          {timestamp.errorCount ? timestamp.errorCount : ''}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<button on:click={() => dispatch('close')}>Close</button>

<style>
  a {
    margin-right: 1rem;
  }

  button {
    margin-top: 1rem;
  }

  .date,
  .time {
    color: var(--oci-blue);
  }

  .error-count {
    color: red;
  }

  input[type='checkbox'] {
    --size: 1rem;
    height: var(--size);
    width: var(--size);
  }
</style>
