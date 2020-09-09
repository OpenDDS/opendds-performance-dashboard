<script>
  import c3 from 'c3';

  export let axis;
  export let data;
  export let title;

  let container;

  $: hideChart = data.columns.length === 0;

  $: if (data.columns.length) {
    c3.generate({axis, bindto: '#open-dds-chart', data});
    handleResize();
  }

  function handleResize() {
    console.log('LineChart.svelte handleResize: entered');
    setTimeout(() => {
      container.style.maxHeight = 'none';
    }, 500);
  }
</script>

<svelte:window on:resize={handleResize} />

<h1>{title}</h1>
{#if !data.columns.length}
  <h2>...loading chart data...</h2>
{/if}
<div bind:this={container} class:hideChart id="open-dds-chart" />

<style>
  .hideChart {
    display: none;
  }

  #open-dds-chart {
    background-color: white;
    border: solid var(--oci-aqua) 5px;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 20px;
  }

  #open-dds-chart :global(svg) {
    width: 100%;
  }
</style>
