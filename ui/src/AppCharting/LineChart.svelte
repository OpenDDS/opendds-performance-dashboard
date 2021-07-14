<script lang="ts">
  import {AxesOptions, Data, generate} from 'c3';
  import {createEventDispatcher, tick} from 'svelte';

  export let axis: AxesOptions;
  export let data: Data;
  export let legendTitle: string;
  export let height: number;

  const CHART_ID = 'open-dds-chart';
  const CHART_SELECTOR = '#' + CHART_ID;

  const LEGEND_TILE_WIDTH = 55;
  const dispatch = createEventDispatcher<{rendered: void}>();

  $: if (data.columns.length) {
    // Allow the rest of the UI to update
    // without blocking to update the chart.
    drawChart(data, axis, height, onRendered);
  }

  async function drawChart(
    data: Data,
    axis: AxesOptions,
    height: number,
    onRendered: () => void
  ): Promise<void> {
    await tick();
    generate({
      axis,
      bindto: CHART_SELECTOR,
      data,
      legend: {
        item: {
          tile: {width: LEGEND_TILE_WIDTH}
        },
        position: 'right'
      },
      onrendered: onRendered,
      size: {height: height}
      // zoom: {enabled: true}
    });
  }

  function onRendered(): void {
    addLegendTitle();
    dispatch('rendered');
  }

  function addLegendTitle(): void {
    const chart = document.querySelector(CHART_SELECTOR);
    // If we don't have a chart, we can't add a legend title.
    if (!chart) return;

    // If there are no legend items then no title is needed.
    const firstLegendItem = chart.querySelector('.c3-legend-item');
    if (!firstLegendItem) return;

    // Get the relative position of the first legend item.
    const itemText = <SVGElement>firstLegendItem.firstChild;
    const legendX: string = itemText.getAttribute('x');
    const legendY: string = itemText.getAttribute('y');

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
    legendTitleText.setAttribute(
      'x',
      (Number(legendX).valueOf() - LEGEND_TILE_WIDTH - 6).toString()
    );
    legendTitleText.setAttribute('y', (Number(legendY) - 20).toString());
    legendTitleText.setAttribute(
      'transform',
      legendContainer.getAttribute('transform')
    );
  }
</script>

<div id={CHART_ID} />

<style>
  #open-dds-chart {
    width: 100%;
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
