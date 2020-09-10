<script>
  import c3 from 'c3';

  export let axis;
  export let data;
  export let title;

  //$: console.log('LineChart.svelte: axis =', axis);
  //$: console.log('LineChart.svelte: data =', data);

  $: hideChart = data.columns.length === 0;

  $: if (data.columns.length) {
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    setTimeout(() => {
      c3.generate({axis, bindto: '#open-dds-chart', data});
    });
  }
</script>

<h1>{title}</h1>
{#if !data.columns.length}
  <h2>...loading chart data...</h2>
{/if}
<div class={`container ${hideChart ? 'hide' : ''}`}>
  <div id="open-dds-chart" />
</div>

<style>
  .container {
    background-color: white;
    border: solid var(--oci-aqua) 5px;
    border-radius: 20px;
    padding: 20px 0;
  }

  .hide {
    display: none;
  }

  #open-dds-chart :global(svg) {
    box-sizing: border-box;
    height: 600px;
    width: 100%;
  }
</style>
