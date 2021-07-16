import {mockBenchmarkMap} from '../__mocks__/mock-benchmarks';
import {deriveSelectOptionsFromData} from './form-data-helpers';

describe('Form Data Helpers', () => {
  test('Test derived options are correct', () => {
    expect(deriveSelectOptionsFromData(mockBenchmarkMap)).toMatchObject({
      allPlotTypes: [
        'Cpu Utilization',
        'Discovery Time Delta',
        'Jitter',
        'Latency',
        'Memory Utilization',
        'Round Trip Jitter',
        'Round Trip Latency',
        'Virtual Memory Utilization'
      ],
      scenarios: {
        disco: {serverCounts: []},
        echo_rtps: {serverCounts: []},
        echo_tcp: {serverCounts: []},
        fan_rtps: {serverCounts: [16, 4]},
        fan_tcp: {serverCounts: [16, 4]},
        showtime_mixed: {serverCounts: []}
      },
      statNames: [
        'count',
        'madev',
        'max',
        'mean',
        'median',
        'min',
        'overflow',
        'stdev'
      ]
    });
  });
});
