<script lang="ts">
  import {errorStore} from './utility/stores';

  export let error: Error | null = null;
  $: hasError = error !== null || $errorStore.length;

  function resetErrors() {
    error = null;
    errorStore.clear();
  }
</script>

{#if hasError}
  <div class="error">
    <h3>An error has occurred</h3>
    <small>Some data may be missing or incorrectly represented</small>
    {#if error}
      <div>{error.message}</div>
    {/if}
    <ul>
      {#each $errorStore as message}
        <li>{message}</li>
      {/each}
    </ul>
    <button on:click={resetErrors}>OK</button>
  </div>
{/if}

<style>
  .error {
    align-items: center;
    backdrop-filter: blur(6px);
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    margin: auto;
    overflow: scroll;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }

  .error > * {
    margin: 0.3rem 0;
  }

  .error button {
    margin-top: 1rem;
    min-width: 10rem;
  }

  ul {
    max-width: 100%;
    overflow-x: scroll;
  }

  li {
    list-style-type: none;
    margin-bottom: 1rem;
    max-width: 80ch;
    white-space: pre-wrap;
  }
</style>
