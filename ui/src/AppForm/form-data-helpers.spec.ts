import {mockBenchmarkMap} from '../__mocks__/mock-benchmarks';
import {deriveSelectOptionsFromData} from './form-data-helpers';

describe('Form Data Helpers', () => {
  const derived = deriveSelectOptionsFromData(mockBenchmarkMap);
  test('Test derived options are correct', () => {
    expect(derived).toMatchObject({
      plotTypes: [
        'Cpu Utilization',
        'Discovery Time Delta',
        'Jitter',
        'Latency',
        'Memory Utilization',
        'Round Trip Jitter',
        'Round Trip Latency',
        'Round Trip Throughput',
        'Throughput',
        'Virtual Memory Utilization'
      ],
      scenarios: {
        'b1_latency-rtps': {serverCounts: []},
        'b1_latency-tcp': {serverCounts: []},
        'b1_latency-udp': {serverCounts: []},
        'disco-rtps': {serverCounts: []},
        'disco-relay': {serverCounts: []},
        'disco-repo': {serverCounts: []},
        'echo-rtps': {serverCounts: []},
        'echo-tcp': {serverCounts: []},
        'fan-rtps': {serverCounts: [16, 4]},
        'fan-tcp': {serverCounts: [16, 4]},
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

describe('Test Mismatches', () => {
  const derived = deriveSelectOptionsFromData(mockBenchmarkMap);
  test('Missing Plot Type', () => {
    const {plotTypes} = derived;
    expect(plotTypes).not.toMatchObject([
      'Cpu Utilization',
      'Discovery Time Delta',
      'Jitter',
      'Latency',
      'Memory Utilization',
      'Round Trip Jitter',
      'Round Trip Latency',
      'Round Trip Throughput',
      'Throughput'
    ]);
  });

  test('Missing Scenario', () => {
    const {scenarios} = derived;
    expect(JSON.stringify(scenarios)).not.toBe(
      JSON.stringify({
        b1_latency_rtps: {serverCounts: []},
        b1_latency_tcp: {serverCounts: []},
        b1_latency_udp: {serverCounts: []},
        disco: {serverCounts: []},
        echo_rtps: {serverCounts: []},
        echo_tcp: {serverCounts: []},
        fan_rtps: {serverCounts: [16, 4]},
        fan_tcp: {serverCounts: [16, 4]}
      })
    );
  });

  test('Stat Mismatch: missing stat', () => {
    const {statNames} = derived;
    expect(statNames).not.toMatchObject([
      'count',
      'madev',
      'max',
      'mean',
      'median',
      'min',
      'overflow'
    ]);
  });
});
