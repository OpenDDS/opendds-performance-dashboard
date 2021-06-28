<script>
  import {fade} from 'svelte/transition';

  import {copyToClipboard} from '../utility/copy-to-clipboard';
  import {generateShareLink} from './share-data';
  export let shareLinks = [];
  export let visible = false;

  $: {
    if (visible) {
      shareLinks = generateShareLink(window.location);
      document.body.classList.add('sharing_visible');
    } else {
      document.body.classList.remove('sharing_visible');
    }
  }

  let copied = false;
  let interval = null;
  async function copy(text) {
    clearInterval(interval);
    copied = text;
    await copyToClipboard(text);
    interval = setTimeout(() => {
      copied = null;
    }, 3000);
  }
</script>

<div class="sharing">
  <button on:click={() => (visible = true)}>Embed and Share Info</button>
  <div class="sharing-info_backdrop" class:visible>
    <div class="sharing-info" role="dialog">
      <span role="button" class="close" on:click={() => (visible = false)}>
        Close [X]
      </span>
      {#each shareLinks as shareLink}
        <h4>
          {shareLink.label}
          <span
            role="button"
            class="copy"
            on:click={() => copy(shareLink.code)}>(Copy)</span>
          {#if copied === shareLink.code}
            <span transition:fade={{duration: 100}}>Copied!</span>
          {/if}
        </h4>
        <pre>{shareLink.code}</pre>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(body.sharing_visible) {
    overflow: hidden;
  }

  .sharing {
    --code-color: #00ff41;
    position: relative;
  }

  .sharing-info_backdrop.visible {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .close {
    color: var(--code-color);
    position: absolute;
    top: 0;
    right: 0;
    padding: 1rem;
  }

  pre {
    right: 0;
    left: 0;
    background-color: transparent;
    border: 1px solid var(--code-color);
    color: var(--code-color);
    padding: 0.5rem 1rem;
    overflow: scroll;
    border-radius: 0.4rem;
  }

  .sharing-info {
    padding: 2rem 1rem;
    background-color: black;
    color: var(--code-color);
    position: fixed;
    width: 80vw;
    height: 60vh;
    border-radius: 1rem;
    word-break: break-all;
    z-index: 9999;
  }

  .sharing-info_backdrop {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  h4 {
    margin-bottom: 0.4rem;
  }

  h4 span.copy {
    cursor: pointer;
  }

  h4 span:hover {
    color: green;
  }
</style>
