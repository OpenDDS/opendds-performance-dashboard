<script lang="ts">
  import { errorStore } from "./utility/stores";

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
    <button role="button" on:click={resetErrors}>OK</button>
  </div>
{/if}

<style>
  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;
    overflow: scroll;
    backdrop-filter: blur(6px);
  }

  .error > * {
    margin: 0.3rem 0;
  }

  .error button {
    margin-top: 1rem;
    min-width: 10rem;
  }

  ul {
    overflow-x: scroll;
    max-width: 100%;
  }

  li {
    list-style-type: none;
    max-width: 80ch;
    white-space: pre-wrap;
    margin-bottom: 1rem;
  }
</style>
