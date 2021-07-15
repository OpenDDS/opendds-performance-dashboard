<script lang="ts">
  export let label: string;
  export let options: unknown[];
  export let value: unknown;
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
    padding: 0.5rem;
    -webkit-appearance: none;
  }
  .label-text {
    margin-bottom: 0.5rem;
  }
</style>
