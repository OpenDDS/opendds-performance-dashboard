<script>
  export let label;
  export let options;
  export let value;
</script>

<label>
  <div class="label-text">{label}</div>
  <select bind:value on:blur on:change>
    {#each options as option}
      <option>{option}</option>
    {/each}
  </select>
</label>

<style>
  .label-text {
    min-width: 12rem;
  }

  select {
    min-width: 10rem;
  }
</style>
