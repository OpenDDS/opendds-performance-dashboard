<script>
  import c3 from 'c3';
  import {onMount} from 'svelte';

  export let axis;
  export let data;
  export let title;

  $: c3.generate({bindto: '#chart', data});

  onMount(() => {
    c3.generate({axis, bindto: '#chart', data});
  });
</script>

<h1>{title}</h1>
<div id="chart" />
