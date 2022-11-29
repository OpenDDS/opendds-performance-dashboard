<script lang="ts">
  import {fade} from 'svelte/transition';

  import {copyToClipboard} from '../utility/copy-to-clipboard';
  import type {ShareLinkOptions} from './generators/ShareLink';
  import {generateShareLinks} from './share-data';

  //----------------------------------------------------------------
  // Const
  //------------------------------------------------------------
  const DEFAULT_FADE = {duration: 100};
  const DELAYED_FADE = {duration: 100, delay: 100};

  //----------------------------------------------------------------
  // Local State
  //------------------------------------------------------------
  let copied: string | boolean = false;
  let interval = null;

  let shareLinks = [];
  let shareOptions: ShareLinkOptions = {
    text_color: undefined
  };

  let visible = false;

  //----------------------------------------------------------------
  // Computed
  //------------------------------------------------------------
  $: if (visible) {
    shareLinks = generateShareLinks(window.location.toString(), shareOptions);
  }

  $: {
    if (visible) {
      document.body.classList.add('sharing_visible');
    } else {
      document.body.classList.remove('sharing_visible');
    }
  }

  //----------------------------------------------------------------
  // Methods
  //------------------------------------------------------------
  async function copy(text: string) {
    clearInterval(interval);
    copied = text;
    await copyToClipboard(text);
    interval = setTimeout(() => {
      copied = null;
    }, 3000);
  }

  interface KeyboardEvent {
    key: string;
  }

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      visible = true;
    }
  }
</script>

<div class="sharing">
  <button on:click={() => (visible = true)} on:keypress={onKeyPress}
    >Embed and Share Info</button
  >
  {#if visible}
    <div
      in:fade={DEFAULT_FADE}
      out:fade={DELAYED_FADE}
      on:click={() => (visible = false)}
      on:keypress={() => (visible = false)}
      class="sharing-info_backdrop"
    >
      <div
        in:fade={DELAYED_FADE}
        out:fade={DEFAULT_FADE}
        on:click|stopPropagation
        on:keypress|stopPropagation
        class="sharing-info"
        role="dialog"
      >
        <span
          role="button"
          class="close"
          on:click={() => (visible = false)}
          on:keypress={() => (visible = false)}
        >
          Close [X]
        </span>

        {#each shareLinks as shareLink}
          <h4>
            {shareLink.label}
            <span
              role="button"
              class="copy"
              on:click={() => copy(shareLink.code)}
              on:keypress={() => copy(shareLink.code)}>(Copy)</span
            >
            {#if copied === shareLink.code}
              <span transition:fade={DEFAULT_FADE}>Copied!</span>
            {/if}
          </h4>
          <pre class:truncate={shareLink.truncate}>{shareLink.code}</pre>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body.sharing_visible) {
    overflow: hidden;
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
  pre.truncate {
    white-space: nowrap;
  }

  .sharing {
    --code-color: #00ff41;
    position: relative;
  }
  .sharing .close {
    color: var(--code-color);
    cursor: pointer;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 0;
  }

  .sharing-info {
    background-color: black;
    border-radius: 1rem;
    color: var(--code-color);
    height: 60vh;
    overflow-y: scroll;
    padding: 2rem 1rem;
    position: fixed;
    width: 80vw;
    z-index: 9999;
  }

  .sharing-info_backdrop {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  pre {
    background-color: transparent;
    border-radius: 0.4rem;
    border: 1px solid var(--code-color);
    color: var(--code-color);
    left: 0;
    overflow: scroll;
    padding: 0.5rem 1rem;
    right: 0;
    white-space: break-spaces;
    word-break: break-all;
  }
</style>
