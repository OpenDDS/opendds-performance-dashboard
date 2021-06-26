<script>
  export let label;
  export let options;
  export let value;
  export let disabled = false;
</script>

<label class:disabled>
  <div class="label-text">{label}</div>
  <select bind:value on:blur on:change {disabled}>
    {#each options as option}
      <option>{option}</option>
    {/each}
  </select>
</label>

<style>
  select {
    background-color: var(--bg-color);
    color: var(--open-dds-red);
    padding: 0.5rem;
  }
  .label-text {
    color: var(--open-dds-red);
    margin-bottom: 0.5rem;
  }
</style>
