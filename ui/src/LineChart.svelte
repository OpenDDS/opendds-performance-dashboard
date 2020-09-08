<script>
  import c3 from 'c3';

  export let axis;
  export let data;
  export let title;

  $: if (data.columns.length) {
    c3.generate({axis, bindto: '#open-dds-chart', data});
  }
</script>

<h1>{title}</h1>
{#if !data.columns.length}
  <p>...loading chart data...</p>
{/if}
<div id="open-dds-chart" />
