<script>
  import c3 from 'c3';

  export let axis;
  export let data;
  export let legendTitle;
  export let title;

  $: console.log('LineChart.svelte x: legendTitle =', legendTitle);

  const CHART_HEIGHT = 500;
  const CHART_SELECTOR = '#open-dds-chart';

  //$: console.log('LineChart.svelte: axis =', axis);
  //$: console.log('LineChart.svelte: data =', data);
  let titleUsed;

  $: hideChart = data.columns.length === 0;

  $: if (data.columns.length) {
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    setTimeout(() => {
      c3.generate({
        axis,
        bindto: CHART_SELECTOR,
        data,
        legend: {position: 'right'},
        onrendered: addLegendTitle,
        onresize: removeLegendTitle,
        size: {height: CHART_HEIGHT}
        //zoom: {enabled: true}
      });

      //addLegendTitle();

      titleUsed = title;
    });
  }

  function addLegendTitle() {
    const chart = document.querySelector(CHART_SELECTOR);
    const firstLegendItem = chart.querySelector('.c3-legend-item');
    if (!firstLegendItem) return;

    const itemText = firstLegendItem.firstChild;
    const x = itemText.getAttribute('x');
    const y = itemText.getAttribute('y');

    const lt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lt.setAttribute('class', 'legend-title');
    lt.setAttribute('x', Number(x) - 17);
    lt.setAttribute('y', Number(y) - 20);
    lt.textContent = legendTitle;

    firstLegendItem.parentElement.insertBefore(lt, firstLegendItem);
  }

  function removeLegendTitle() {
    const chart = document.querySelector(CHART_SELECTOR);
    const lt = chart.querySelector('.legend-title');
    if (lt) lt.parentElement.removeChild(lt);
  }
</script>

{#if titleUsed}
  <h2>{titleUsed}</h2>
{/if}

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

  h2 {
    text-align: center;
  }

  .hide {
    display: none;
  }

  #open-dds-chart :global(.c3-axis-x-label),
  #open-dds-chart :global(.c3-axis-y-label) {
    fill: var(--oci-blue);
    font-size: 0.8rem;
  }

  #open-dds-chart :global(.legend-title) {
    font-size: 1rem;
    fill: var(--oci-blue);
  }

  #open-dds-chart :global(svg) {
    box-sizing: border-box;
    width: 100%;
  }

  #open-dds-chart :global(.tick > line) {
    display: none;
  }
</style>
