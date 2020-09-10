<script>
  export let label;
  export let options;
  export let value;
</script>

<label>
  {label}
  <select bind:value on:blur on:change>
    {#each options as option}
      <option>{option}</option>
    {/each}
  </select>
</label>
