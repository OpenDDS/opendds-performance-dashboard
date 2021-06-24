<script>
  export let label;
  export let options;
  export let value;
</script>

<label>
  <span>{label}</span>
  <select bind:value on:blur on:change>
    {#each options as option}
      <option>{option}</option>
    {/each}
  </select>
</label>

<style>
  label > span {
    min-width: 10rem;
  }

  select {
    min-width: 10rem;
  }
</style>
