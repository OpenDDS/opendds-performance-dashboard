<script>
  export let timestamp;
  export let selected;
  export let maxSelected;

  $: disabled = maxSelected && !selected;

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';
</script>

<tr class:selected class:disabled on:click {disabled}>
  <td><input type="checkbox" checked={selected} /></td>
  <td class="date">{timestamp.date}</td>
  <td class="time">{timestamp.time}</td>
  <td>
    <a
      on:click|stopPropagation
      href={GITHUB_COMMIT_URL + timestamp.commit}
      rel="noopener"
      title={timestamp.commit}
      target="_blank">{timestamp.commit.substr(0, 7)}</a>
  </td>
  <td class="hash">{timestamp.hash ? timestamp.hash : ''}</td>
  <td class="error-count">
    {timestamp.errorCount ? timestamp.errorCount : ''}
  </td>
</tr>

<style>
  input[type='checkbox'] {
    --size: 1rem;
    height: var(--size);
    width: var(--size);
  }

  .date,
  .time {
    color: var(--oci-blue);
  }

  .error-count {
    color: red;
  }

  tr {
    cursor: pointer;
  }

  tr.selected {
    background-color: rgba(var(--oci-orange-rgb), 0.1);
  }

  tr.disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  }
</style>
