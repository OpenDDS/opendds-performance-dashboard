<script>
  import c3 from 'c3';
  import {onMount} from 'svelte';

  export let data;
  export let title;

  onMount(() => {
    c3.generate({bindto: '#chart', data});
  });
</script>

<h1>{title}</h1>
<div id="chart" />
