<script>
  import c3 from 'c3';
  import * as d3 from 'd3';

  export let axis;
  export let data;
  export let legendTitle;
  export let title;

  const CHART_HEIGHT = 500;
  const CHART_SELECTOR = '#open-dds-chart';
  const LEGEND_TILE_WIDTH = 55;

  let container;
  let titleUsed = '';

  $: hideChart = data.columns.length === 0;

  $: if (data.columns.length) {
    titleUsed = '';

    // Allow the rest of the UI to update
    // without blocking to update the chart.
    setTimeout(() => {
      c3.generate({
        axis,
        bindto: CHART_SELECTOR,
        data,
        legend: {
          item: {
            tile: {width: LEGEND_TILE_WIDTH}
          },
          position: 'right'
        },
        onrendered: addLegendTitle,
        size: {height: CHART_HEIGHT}
        //zoom: {enabled: true}
      });
    });
  }

  let cachedX, cachedY;

  function getRelativeXY(x, y, svg, element) {
    var p = svg.createSVGPoint();
    var ctm = element.getCTM();
    p.x = x;
    p.y = y;
    return p.matrixTransform(ctm);
  }

  function addLegendTitle() {
    const chart = document.querySelector(CHART_SELECTOR);
    // If we don't have a chart, we can't add a legend title.
    if (!chart) return;

    // If there are no legend items then no title is needed.
    const firstLegendItem = chart.querySelector('.c3-legend-item');
    if (!firstLegendItem) return;

    // Get the relative position of the first legend item.
    const itemText = firstLegendItem.firstChild;
    const legendX = itemText.getAttribute('x');
    const legendY = itemText.getAttribute('y');

    // Get the SVG group element that contains the legend.
    const legendContainer = firstLegendItem.parentElement;

    // If we don't already have a text element for the title,
    // create it and insert it before the legend container.
    let legendTitleText = chart.querySelector('.legend-title');
    if (!legendTitleText) {
      legendTitleText = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      legendTitleText.setAttribute('class', 'legend-title');
      legendContainer.parentElement.insertBefore(
        legendTitleText,
        legendContainer
      );
    }

    // Set the text and position of the legend title.
    legendTitleText.textContent = legendTitle;
    legendTitleText.setAttribute('x', legendX - LEGEND_TILE_WIDTH - 6);
    legendTitleText.setAttribute('y', legendY - 20);
    legendTitleText.setAttribute(
      'transform',
      legendContainer.getAttribute('transform')
    );

    titleUsed = title;
  }
</script>

<h2>{titleUsed}</h2>

{#if !data.columns.length}
  <h3>...loading chart data...</h3>
{/if}

<div bind:this={container} class={`container ${hideChart ? 'hide' : ''}`}>
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
