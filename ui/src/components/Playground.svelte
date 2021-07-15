<script>
  import c3 from 'c3';
  import {onMount} from 'svelte';

  onMount(() => {
    const chart = c3.generate({
      bindto: '#time-series-chart',
      data: {
        x: 'x',
        xFormat: '%Y-%m-%dT%H:%M:%S',
        columns: [
          [
            'x',
            '2013-01-01T01:00:00',
            '2013-01-01T02:00:00',
            '2013-01-03T03:00:00',
            '2013-01-04T04:00:00',
            '2013-01-05T05:00:00',
            '2013-01-06T06:00:00'
          ],
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 130, 340, 200, 500, 250, 350]
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d %H:%M:%S'
          }
        }
      }
    });

    setTimeout(function () {
      chart.load({
        columns: [['data3', 400, 500, 450, 700, 600, 500]]
      });
    }, 1000);
  });
</script>

<div id="time-series-chart" />
