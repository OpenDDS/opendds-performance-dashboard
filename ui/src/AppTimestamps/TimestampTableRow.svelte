<script lang="ts">
  import type {TimestampViewModel} from '../types';

  export let timestamp: TimestampViewModel;
  export let selected: boolean;
  export let maxSelected: boolean;

  $: disabled = maxSelected && !selected;

  const GITHUB_COMMIT_URL =
    'https://github.com/objectcomputing/OpenDDS/commit/';
  const GITHUB_TAG_URL =
    'https://github.com/objectcomputing/OpenDDS/releases/tag/';
</script>

<tr class:selected class:disabled on:click>
  <td><input type="checkbox" checked={selected} /></td>
  <td class="date">{timestamp.date}</td>
  <td class="time">{timestamp.time}</td>
  <td>
    <a
      on:click|stopPropagation
      href={GITHUB_COMMIT_URL + timestamp.commit}
      rel="noopener"
      title={timestamp.commit}
      target="_blank">{timestamp.commit.substr(0, 7)}</a
    >
  </td>
  <td class="hash">
    {#if timestamp.tag}
      <a
        href={`${GITHUB_TAG_URL}${timestamp.tag.name}`}
        rel="noopener"
        target="_blank">{timestamp.tag.name}</a
      >
    {/if}
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

  .error-count {
    color: red;
  }

  tr {
    cursor: pointer;
  }

  tr.selected {
    background-color: rgba(var(--oci-orange-rgb), 0.1);
  }
</style>
