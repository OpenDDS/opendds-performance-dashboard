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
    dispatch('change', timestamps);
  }

  const rowPressHandler = timestamp =>
    function (event) {
      updateIndex(timestamp.key, !timestamp.selected);
    };

  function updateIndex(key, selected) {
    console.log('Updating Index');
    const index = timestamps.findIndex(i => i.key === key);
    timestamps[index].selected = selected;
    dispatch('change', timestamps);
  }

  function onUncheckAll() {
    timestamps = timestamps.map(t => {
      t.selected = false;
      return t;
    });
    dispatch('change', timestamps);
  }

  const onClose = () => dispatch('close');
</script>

<h2>Select the timestamps to plot.</h2>
<div class="panel">
  <div class="row">
    <label>
      <span># of Recent Tests</span>
      <input
        type="number"
        min={MIN_TIMESTAMPS}
        max={MAX_TIMESTAMPS}
        on:change={handleChange}
        value={recentCount} />
    </label>

    <div>
      <button on:click={onUncheckAll}>Uncheck All</button>
      <button on:click={onClose}>Close</button>
    </div>
  </div>

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
      {#each [...timestamps].reverse() as timestamp (timestamp.full)}
        <tr
          class:selected={timestamp.selected}
          on:click={rowPressHandler(timestamp)}>
          <td><input type="checkbox" checked={timestamp.selected} /></td>
          <td class="date">{timestamp.date}</td>
          <td class="time">{timestamp.time}</td>
          <td>
            <a
              on:click|stopPropagation
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

  <button on:click={onClose}>Close</button>
</div>

<style>
  a {
    margin-right: 1rem;
  }

  input[type='checkbox'] {
    --size: 1rem;
    height: var(--size);
    width: var(--size);
  }
  label {
    margin-bottom: 0;
  }

  .date,
  .time {
    color: var(--oci-blue);
  }

  .panel {
    border: 3px solid var(--oci-aqua);
    padding: 1rem;
    border-radius: 1rem;
    background-color: white;
    margin-top: 2rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }
  .error-count {
    color: red;
  }

  table {
    width: 100%;
  }

  tr {
    cursor: pointer;
  }
  tr.selected {
    background-color: rgba(var(--oci-orange-rgb), 0.1);
  }
</style>
