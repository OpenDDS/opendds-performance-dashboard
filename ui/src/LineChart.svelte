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
      console.log('LineChart.svelte: generating chart');
      c3.generate({axis, bindto: '#open-dds-chart', data});
    });
  }
</script>

<!--h2>{title}</h2-->
{#if !data.columns.length}
  <h3>...loading chart data...</h3>
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

  #open-dds-chart :global(.c3-axis-x-label),
  #open-dds-chart :global(.c3-axis-y-label) {
    fill: var(--oci-blue);
    font-size: 0.8rem;
  }

  #open-dds-chart :global(svg) {
    box-sizing: border-box;
    height: 800px;
    width: 100%;
  }

  #open-dds-chart :global(.tick > line) {
    display: none;
  }
</style>
