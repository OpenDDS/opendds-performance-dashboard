import type {Benchmarks} from 'src/types';

export const mockBenchmarkMap: Benchmarks = JSON.parse(
  JSON.stringify({
    '2022-11-22T00:00:33+0000_e1d588f4559a2dfedf817c9844e132dfea00fad6_3001953180aa8a16f1f90a0364666c7e':
      {
        run_parameters: {
          TIMESTAMP: '2022-11-22T00:00:33+0000',
          GIT_SHA: 'e1d588f4559a2dfedf817c9844e132dfea00fad6',
          BUILD_HASH: '3001953180aa8a16f1f90a0364666c7e'
        },
        'b1-latency-rtps_1000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 1000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.348897,
          'Round Trip Throughput': {
            count: 11999,
            min: 96557.665959,
            max: 108799.02662,
            mean: 108787.932998,
            stdev: 150.203466,
            median: 108797.485109,
            madev: 1.026487,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001623,
            mean: 0.00002,
            stdev: 0.000035,
            median: 0.000013,
            madev: 0.000009,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.00069,
            max: 0.002505,
            mean: 0.00086,
            stdev: 0.000039,
            median: 0.00086,
            madev: 0.00002,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 107745.441491,
            max: 108915.243218,
            mean: 108798.716963,
            stdev: 13.347386,
            median: 108799.679347,
            madev: 0.159821,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.319288,
            max: 0.348897,
            mean: 0.336113,
            stdev: 0.0,
            median: 0.338133,
            madev: 0.008487,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.476669,
            mean: 1.460282,
            stdev: 0.125906,
            median: 1.476669,
            madev: 0.0,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.003339,
            mean: 0.000023,
            stdev: 0.000046,
            median: 0.000015,
            madev: 0.000011,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000276,
            max: 0.00424,
            mean: 0.00069,
            stdev: 0.000056,
            median: 0.000733,
            madev: 0.000186,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.580562,
            mean: 2.726891,
            stdev: 0.948397,
            median: 3.053435,
            madev: 0.031397,
            overflow: 0
          }
        },
        'b1-latency-rtps_16000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 16000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.144365,
          'Round Trip Throughput': {
            count: 11999,
            min: 1353834.854195,
            max: 1608778.503016,
            mean: 1608563.378006,
            stdev: 3100.589354,
            median: 1608752.703129,
            madev: 19.53074,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.002027,
            mean: 0.000022,
            stdev: 0.000036,
            median: 0.000017,
            madev: 0.00001,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000871,
            max: 0.003059,
            mean: 0.001011,
            stdev: 0.000039,
            median: 0.001011,
            madev: 0.000022,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 1499555.017674,
            max: 1614321.706681,
            mean: 1608762.439879,
            stdev: 901.721367,
            median: 1608792.509939,
            madev: 10.745715,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.015413,
            max: 0.144365,
            mean: 0.079319,
            stdev: 0.0,
            median: 0.07875,
            madev: 0.053993,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.50303,
            mean: 1.423691,
            stdev: 0.122981,
            median: 1.474117,
            madev: 0.028912,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.004156,
            mean: 0.000034,
            stdev: 0.000053,
            median: 0.000027,
            madev: 0.000017,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000592,
            max: 0.004932,
            mean: 0.000853,
            stdev: 0.000053,
            median: 0.000859,
            madev: 0.000035,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.598971,
            mean: 2.681157,
            stdev: 0.937593,
            median: 3.053435,
            madev: 0.203694,
            overflow: 0
          }
        },
        'b1-latency-rtps_2500': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 2500.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.349326,
          'Round Trip Throughput': {
            count: 11999,
            min: 223379.341018,
            max: 258796.838841,
            mean: 258767.068639,
            stdev: 427.646398,
            median: 258793.059329,
            madev: 3.015449,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001141,
            mean: 0.000023,
            stdev: 0.000045,
            median: 0.000015,
            madev: 0.000008,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.00075,
            max: 0.002041,
            mean: 0.000896,
            stdev: 0.000043,
            median: 0.000893,
            madev: 0.000019,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 250245.120316,
            max: 258800.094469,
            mean: 258793.8409,
            stdev: 91.032312,
            median: 258798.810426,
            madev: 0.637496,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.320101,
            max: 0.349326,
            mean: 0.335098,
            stdev: 0.0,
            median: 0.335481,
            madev: 0.009378,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.46774,
            mean: 1.407784,
            stdev: 0.121384,
            median: 1.466251,
            madev: 0.001488,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.002285,
            mean: 0.000017,
            stdev: 0.000043,
            median: 0.000009,
            madev: 0.000006,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.00025,
            max: 0.003266,
            mean: 0.000725,
            stdev: 0.000056,
            median: 0.000783,
            madev: 0.000321,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.589743,
            mean: 2.694278,
            stdev: 0.932968,
            median: 3.037974,
            madev: 0.195597,
            overflow: 0
          }
        },
        'b1-latency-rtps_32000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 32000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.038141,
          'Round Trip Throughput': {
            count: 11999,
            min: 2604945.288274,
            max: 3208747.918777,
            mean: 3208237.223607,
            stdev: 7441.369167,
            median: 3208683.458633,
            madev: 48.442536,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001545,
            mean: 0.000027,
            stdev: 0.000038,
            median: 0.00002,
            madev: 0.000012,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000983,
            max: 0.002694,
            mean: 0.001138,
            stdev: 0.000044,
            median: 0.001133,
            madev: 0.000023,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 2903368.270929,
            max: 3208839.283866,
            mean: 3208656.534875,
            stdev: 2649.536514,
            median: 3208775.538511,
            madev: 18.899705,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.015824,
            max: 0.038141,
            mean: 0.026669000000000002,
            stdev: 0.0,
            median: 0.026356,
            madev: 0.009347,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.414379,
            mean: 1.391719,
            stdev: 0.120539,
            median: 1.406088,
            madev: 0.003614,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.003257,
            mean: 0.000035,
            stdev: 0.000051,
            median: 0.000027,
            madev: 0.000016,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000738,
            max: 0.004179,
            mean: 0.000978,
            stdev: 0.000056,
            median: 0.000973,
            madev: 0.000036,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.376623,
            mean: 2.718282,
            stdev: 0.941581,
            median: 3.084832,
            madev: 0.22769,
            overflow: 0
          }
        },
        'b1-latency-rtps_5000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 5000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.348736,
          'Round Trip Throughput': {
            count: 11999,
            min: 441872.221635,
            max: 508793.850341,
            mean: 508736.611852,
            stdev: 817.464572,
            median: 508786.746262,
            madev: 5.225811,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001677,
            mean: 0.000021,
            stdev: 0.00003,
            median: 0.000015,
            madev: 0.000009,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000718,
            max: 0.002578,
            mean: 0.000896,
            stdev: 0.000036,
            median: 0.000895,
            madev: 0.000021,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 497864.944153,
            max: 508959.872778,
            mean: 508793.445879,
            stdev: 98.882001,
            median: 508797.578679,
            madev: 2.017557,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.319157,
            max: 0.348736,
            mean: 0.337041,
            stdev: 0.0,
            median: 0.340135,
            madev: 0.007581,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.48092,
            mean: 1.405853,
            stdev: 0.121434,
            median: 1.357404,
            madev: 0.0,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.003323,
            mean: 0.000026,
            stdev: 0.000041,
            median: 0.000017,
            madev: 0.000013,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000357,
            max: 0.004029,
            mean: 0.000735,
            stdev: 0.000114,
            median: 0.000741,
            madev: 0.000038,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.367875,
            mean: 2.609409,
            stdev: 0.90611,
            median: 2.842377,
            madev: 0.211057,
            overflow: 0
          }
        },
        'b1-latency-rtps_8000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'rtps',
            Bytes: 8000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.352034,
          'Round Trip Throughput': {
            count: 11999,
            min: 688111.094208,
            max: 808789.836126,
            mean: 808686.78334,
            stdev: 1461.875287,
            median: 808775.980013,
            madev: 9.580604,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000785,
            mean: 0.000038,
            stdev: 0.000032,
            median: 0.000031,
            madev: 0.000016,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000783,
            max: 0.001724,
            mean: 0.000973,
            stdev: 0.000043,
            median: 0.000969,
            madev: 0.000025,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 755879.86781,
            max: 808928.11399,
            mean: 808776.494108,
            stdev: 443.123422,
            median: 808794.811624,
            madev: 3.776364,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.320688,
            max: 0.352034,
            mean: 0.340584,
            stdev: 0.0,
            median: 0.344807,
            madev: 0.006147,
            overflow: 0
          },
          'Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 1.480708,
            mean: 1.459885,
            stdev: 0.125938,
            median: 1.465826,
            madev: 0.0,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.001232,
            mean: 0.000039,
            stdev: 0.000034,
            median: 0.000032,
            madev: 0.000018,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000546,
            max: 0.002086,
            mean: 0.000807,
            stdev: 0.000048,
            median: 0.000803,
            madev: 0.000034,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 271,
            min: 0.0,
            max: 0.002119,
            mean: 0.002088,
            stdev: 0.000187,
            median: 0.002119,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 271,
            min: 0.0,
            max: 3.580562,
            mean: 2.731571,
            stdev: 0.948107,
            median: 3.053435,
            madev: 0.246057,
            overflow: 0
          }
        },
        'b1-latency-tcp_1000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 1000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.344019,
          'Round Trip Throughput': {
            count: 11999,
            min: 95055.83001,
            max: 108799.114324,
            mean: 108788.479631,
            stdev: 161.435281,
            median: 108797.831285,
            madev: 0.934678,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000856,
            mean: 0.000024,
            stdev: 0.000023,
            median: 0.000022,
            madev: 0.000005,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000575,
            max: 0.001553,
            mean: 0.000717,
            stdev: 0.000026,
            median: 0.000716,
            madev: 0.000016,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 103558.776411,
            max: 108869.378099,
            mean: 108798.214722,
            stdev: 42.895099,
            median: 108799.729726,
            madev: 0.432607,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.327616,
            max: 0.344019,
            mean: 0.335626,
            stdev: 0.0,
            median: 0.335434,
            madev: 0.007317,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.597634,
            mean: 1.495883,
            stdev: 0.134856,
            median: 1.488574,
            madev: 0.002763,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.001737,
            mean: 0.000024,
            stdev: 0.000029,
            median: 0.000022,
            madev: 0.000005,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000393,
            max: 0.002262,
            mean: 0.000554,
            stdev: 0.000034,
            median: 0.000553,
            madev: 0.00002,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.015075,
            mean: 1.860849,
            stdev: 0.601426,
            median: 2.035623,
            madev: 0.254452,
            overflow: 0
          }
        },
        'b1-latency-tcp_16000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 16000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.34506,
          'Round Trip Throughput': {
            count: 11999,
            min: 1387015.524176,
            max: 1608783.344007,
            mean: 1608605.603915,
            stdev: 2676.12633,
            median: 1608760.495775,
            madev: 15.897185,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000662,
            mean: 0.000036,
            stdev: 0.000058,
            median: 0.000017,
            madev: 0.000011,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000663,
            max: 0.001543,
            mean: 0.000805,
            stdev: 0.000052,
            median: 0.000795,
            madev: 0.000019,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 1526799.999734,
            max: 1613660.668666,
            mean: 1608778.239297,
            stdev: 678.144608,
            median: 1608795.357366,
            madev: 8.904637,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.32836,
            max: 0.34506,
            mean: 0.336376,
            stdev: 0.0,
            median: 0.336042,
            madev: 0.006827,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.573611,
            mean: 1.518282,
            stdev: 0.135492,
            median: 1.511109,
            madev: 0.036353,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.001014,
            mean: 0.000037,
            stdev: 0.000082,
            median: 0.000012,
            madev: 0.00001,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000353,
            max: 0.001731,
            mean: 0.000644,
            stdev: 0.000074,
            median: 0.000628,
            madev: 0.000076,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.007518,
            mean: 1.988627,
            stdev: 0.645019,
            median: 2.040816,
            madev: 0.24926,
            overflow: 0
          }
        },
        'b1-latency-tcp_2500': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 2500.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.345566,
          'Round Trip Throughput': {
            count: 11999,
            min: 224914.494687,
            max: 258797.267592,
            mean: 258770.053081,
            stdev: 407.22591,
            median: 258794.176978,
            madev: 2.300822,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.002114,
            mean: 0.000012,
            stdev: 0.000041,
            median: 0.000006,
            madev: 0.000004,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000634,
            max: 0.002839,
            mean: 0.000747,
            stdev: 0.000036,
            median: 0.000744,
            madev: 0.000016,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 246241.440303,
            max: 258800.89001,
            mean: 258792.127131,
            stdev: 124.436224,
            median: 258798.402273,
            madev: 0.888144,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.329405,
            max: 0.345566,
            mean: 0.337435,
            stdev: 0.0,
            median: 0.337386,
            madev: 0.006954,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.572973,
            mean: 1.44181,
            stdev: 0.130343,
            median: 1.389505,
            madev: 0.084611,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.00424,
            mean: 0.000012,
            stdev: 0.000057,
            median: 0.000006,
            madev: 0.000004,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000364,
            max: 0.004847,
            mean: 0.000599,
            stdev: 0.000078,
            median: 0.0006,
            madev: 0.000038,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.007518,
            mean: 1.842196,
            stdev: 0.600229,
            median: 2.03304,
            madev: 0.247325,
            overflow: 0
          }
        },
        'b1-latency-tcp_32000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 32000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.140173,
          'Round Trip Throughput': {
            count: 11999,
            min: 2727316.306475,
            max: 3208763.241884,
            mean: 3208391.308381,
            stdev: 5730.939621,
            median: 3208719.822443,
            madev: 33.766691,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000716,
            mean: 0.000023,
            stdev: 0.000031,
            median: 0.000015,
            madev: 0.00001,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000712,
            max: 0.001687,
            mean: 0.000845,
            stdev: 0.000034,
            median: 0.000844,
            madev: 0.000018,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 3048905.632151,
            max: 3210555.286117,
            mean: 3208746.11193,
            stdev: 1356.400511,
            median: 3208788.578314,
            madev: 14.972075,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.122901,
            max: 0.140173,
            mean: 0.131723,
            stdev: 0.0,
            median: 0.131908,
            madev: 0.00772,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.61783,
            mean: 1.4991,
            stdev: 0.136597,
            median: 1.493676,
            madev: 0.017857,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.000936,
            mean: 0.000025,
            stdev: 0.000042,
            median: 0.000013,
            madev: 0.00001,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000421,
            max: 0.001788,
            mean: 0.000686,
            stdev: 0.000054,
            median: 0.000691,
            madev: 0.000081,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.02267,
            mean: 2.088948,
            stdev: 0.676394,
            median: 2.295918,
            madev: 0.204081,
            overflow: 0
          }
        },
        'b1-latency-tcp_5000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 5000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.139577,
          'Round Trip Throughput': {
            count: 11999,
            min: 444031.597456,
            max: 508795.008883,
            mean: 508742.304368,
            stdev: 770.313935,
            median: 508788.134108,
            madev: 5.046278,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001958,
            mean: 0.000012,
            stdev: 0.000036,
            median: 0.000006,
            madev: 0.000004,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000595,
            max: 0.00266,
            mean: 0.00074,
            stdev: 0.000037,
            median: 0.000735,
            madev: 0.000023,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 478339.30521,
            max: 510384.667835,
            mean: 508788.397765,
            stdev: 250.998482,
            median: 508797.557601,
            madev: 3.119084,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.123916,
            max: 0.139577,
            mean: 0.131737,
            stdev: 0.0,
            median: 0.131729,
            madev: 0.007715,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.609752,
            mean: 1.534484,
            stdev: 0.142177,
            median: 1.554477,
            madev: 0.055274,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.00387,
            mean: 0.000012,
            stdev: 0.000048,
            median: 0.000006,
            madev: 0.000003,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000306,
            max: 0.004316,
            mean: 0.000587,
            stdev: 0.00004,
            median: 0.000634,
            madev: 0.000121,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.015075,
            mean: 1.865009,
            stdev: 0.607546,
            median: 2.040816,
            madev: 0.0051919999999999996,
            overflow: 0
          }
        },
        'b1-latency-tcp_8000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'tcp',
            Bytes: 8000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.344956,
          'Round Trip Throughput': {
            count: 11999,
            min: 705029.217132,
            max: 808792.054055,
            mean: 808708.628387,
            stdev: 1238.688237,
            median: 808781.177754,
            madev: 7.789202,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001881,
            mean: 0.000025,
            stdev: 0.000045,
            median: 0.000016,
            madev: 0.000009,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000626,
            max: 0.002631,
            mean: 0.000768,
            stdev: 0.000041,
            median: 0.000765,
            madev: 0.000017,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 764695.571175,
            max: 811383.404189,
            mean: 808785.106976,
            stdev: 362.500469,
            median: 808797.343069,
            madev: 4.039757,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.329037,
            max: 0.344956,
            mean: 0.336731,
            stdev: 0.0,
            median: 0.336466,
            madev: 0.006781,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.504943,
            mean: 1.483657,
            stdev: 0.129205,
            median: 1.488149,
            madev: 0.002551,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.003772,
            mean: 0.000026,
            stdev: 0.000064,
            median: 0.00001,
            madev: 0.000008,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000329,
            max: 0.004321,
            mean: 0.000604,
            stdev: 0.000079,
            median: 0.000602,
            madev: 0.000043,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.00214,
            mean: 0.002108,
            stdev: 0.00019,
            median: 0.00214,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.258145,
            mean: 1.910457,
            stdev: 0.627096,
            median: 2.040816,
            madev: 0.255102,
            overflow: 0
          }
        },
        'b1-latency-udp_1000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 1000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.142749,
          'Round Trip Throughput': {
            count: 11999,
            min: 95489.155486,
            max: 108798.958366,
            mean: 108788.178704,
            stdev: 158.156685,
            median: 108797.568796,
            madev: 1.063653,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000435,
            mean: 0.000017,
            stdev: 0.000019,
            median: 0.000012,
            madev: 0.000007,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000592,
            max: 0.001201,
            mean: 0.00073,
            stdev: 0.000023,
            median: 0.000733,
            madev: 0.000011,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 104121.597948,
            max: 108800.451612,
            mean: 108797.089379,
            stdev: 43.838581,
            median: 108799.399573,
            madev: 0.338945,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.125494,
            max: 0.142749,
            mean: 0.133871,
            stdev: 0.0,
            median: 0.13362,
            madev: 0.008123,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.488361,
            mean: 1.422561,
            stdev: 0.123907,
            median: 1.379088,
            madev: 0.107997,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.000685,
            mean: 0.000015,
            stdev: 0.000019,
            median: 0.00001,
            madev: 0.000006,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000284,
            max: 0.001281,
            mean: 0.000563,
            stdev: 0.000036,
            median: 0.000561,
            madev: 0.000047,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 2.763819,
            mean: 1.914802,
            stdev: 0.618755,
            median: 2.035623,
            madev: 0.242857,
            overflow: 0
          }
        },
        'b1-latency-udp_16000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 16000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.143097,
          'Round Trip Throughput': {
            count: 11999,
            min: 1388114.622305,
            max: 1608780.782892,
            mean: 1608601.514439,
            stdev: 2656.748934,
            median: 1608757.569821,
            madev: 17.996152,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000786,
            mean: 0.000032,
            stdev: 0.000045,
            median: 0.00002,
            madev: 0.000011,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000683,
            max: 0.001644,
            mean: 0.000876,
            stdev: 0.000045,
            median: 0.000877,
            madev: 0.000022,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 1500861.353361,
            max: 1642002.438712,
            mean: 1608775.612518,
            stdev: 940.757858,
            median: 1608793.520213,
            madev: 11.434644,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.12421,
            max: 0.143097,
            mean: 0.133495,
            stdev: 0.0,
            median: 0.133336,
            madev: 0.009093,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.500904,
            mean: 1.42445,
            stdev: 0.124092,
            median: 1.386742,
            madev: 0.100343,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.000715,
            mean: 0.000021,
            stdev: 0.000022,
            median: 0.000012,
            madev: 0.000009,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.00032,
            max: 0.001297,
            mean: 0.000697,
            stdev: 0.000095,
            median: 0.000704,
            madev: 0.000024,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.015075,
            mean: 2.02488,
            stdev: 0.657979,
            median: 2.258472,
            madev: 0.228015,
            overflow: 0
          }
        },
        'b1-latency-udp_2500': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 2500.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.348798,
          'Round Trip Throughput': {
            count: 11999,
            min: 226660.235868,
            max: 258797.742001,
            mean: 258770.744466,
            stdev: 387.48031,
            median: 258793.948734,
            madev: 2.474199,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000907,
            mean: 0.000015,
            stdev: 0.000021,
            median: 0.000012,
            madev: 0.000007,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000581,
            max: 0.00167,
            mean: 0.000766,
            stdev: 0.000022,
            median: 0.000767,
            madev: 0.000012,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 243546.167714,
            max: 262430.063858,
            mean: 258795.185711,
            stdev: 132.723503,
            median: 258798.721945,
            madev: 1.90396,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.317336,
            max: 0.348798,
            mean: 0.335286,
            stdev: 0.0,
            median: 0.337506,
            madev: 0.008711,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.488149,
            mean: 1.417194,
            stdev: 0.123458,
            median: 1.368671,
            madev: 0.118201,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.001858,
            mean: 0.000017,
            stdev: 0.000026,
            median: 0.00001,
            madev: 0.000008,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000291,
            max: 0.002609,
            mean: 0.000604,
            stdev: 0.000026,
            median: 0.000653,
            madev: 0.000152,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.007518,
            mean: 1.864132,
            stdev: 0.607627,
            median: 2.035623,
            madev: 0.254452,
            overflow: 0
          }
        },
        'b1-latency-udp_32000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 32000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.349256,
          'Round Trip Throughput': {
            count: 11999,
            min: 2706442.806532,
            max: 3208760.668893,
            mean: 3208360.533377,
            stdev: 5978.91842,
            median: 3208710.590677,
            madev: 36.877181,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000621,
            mean: 0.000024,
            stdev: 0.000021,
            median: 0.00002,
            madev: 0.000011,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000727,
            max: 0.001655,
            mean: 0.000934,
            stdev: 0.000032,
            median: 0.000932,
            madev: 0.000016,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 3025710.619557,
            max: 3217755.738214,
            mean: 3208740.455135,
            stdev: 1496.092995,
            median: 3208786.26744,
            madev: 19.748036,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.316771,
            max: 0.349256,
            mean: 0.335014,
            stdev: 0.0,
            median: 0.337015,
            madev: 0.009167,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.677994,
            mean: 1.496318,
            stdev: 0.135122,
            median: 1.39886,
            madev: 0.180066,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.000871,
            mean: 0.000028,
            stdev: 0.000027,
            median: 0.000021,
            madev: 0.000016,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000559,
            max: 0.001574,
            mean: 0.000771,
            stdev: 0.00004,
            median: 0.00077,
            madev: 0.000021,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.02267,
            mean: 2.083257,
            stdev: 0.679348,
            median: 2.290076,
            madev: 0.045687,
            overflow: 0
          }
        },
        'b1-latency-udp_5000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 5000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.142243,
          'Round Trip Throughput': {
            count: 11999,
            min: 442677.177233,
            max: 508794.877022,
            mean: 508741.353682,
            stdev: 799.787724,
            median: 508788.168053,
            madev: 5.028516,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.000547,
            mean: 0.000015,
            stdev: 0.000019,
            median: 0.000009,
            madev: 0.000007,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.000636,
            max: 0.00138,
            mean: 0.000768,
            stdev: 0.000027,
            median: 0.000767,
            madev: 0.000017,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 477472.683035,
            max: 512701.866283,
            mean: 508790.004905,
            stdev: 262.904835,
            median: 508797.662737,
            madev: 3.865677,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.12278,
            max: 0.142243,
            mean: 0.132482,
            stdev: 0.0,
            median: 0.132452,
            madev: 0.009406,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.550438,
            mean: 1.527384,
            stdev: 0.133947,
            median: 1.54236,
            madev: 0.001488,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.00077,
            mean: 0.000014,
            stdev: 0.000021,
            median: 0.000007,
            madev: 0.000004,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000267,
            max: 0.001574,
            mean: 0.000607,
            stdev: 0.000025,
            median: 0.000698,
            madev: 0.000184,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.266331,
            mean: 1.931054,
            stdev: 0.628643,
            median: 2.035623,
            madev: 0.242857,
            overflow: 0
          }
        },
        'b1-latency-udp_8000': {
          scenario_parameters: {
            Base: 'b1_latency',
            Config: 'udp',
            Bytes: 8000.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.34863,
          'Round Trip Throughput': {
            count: 11999,
            min: 699483.646499,
            max: 808791.743478,
            mean: 808701.522825,
            stdev: 1320.872937,
            median: 808781.289872,
            madev: 8.127977,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 11999,
            min: 0.0,
            max: 0.001919,
            mean: 0.000031,
            stdev: 0.000036,
            median: 0.000023,
            madev: 0.000014,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 12000,
            min: 0.00067,
            max: 0.002739,
            mean: 0.000815,
            stdev: 0.000042,
            median: 0.000822,
            madev: 0.000026,
            overflow: 0
          },
          Throughput: {
            count: 23998,
            min: 760022.015078,
            max: 819586.82812,
            mean: 808786.038351,
            stdev: 416.198229,
            median: 808796.128386,
            madev: 6.781141,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.316769,
            max: 0.34863,
            mean: 0.334834,
            stdev: 0.0,
            median: 0.336968,
            madev: 0.009232,
            overflow: 0
          },
          'Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 1.476031,
            mean: 1.416685,
            stdev: 0.123378,
            median: 1.378876,
            madev: 0.097154,
            overflow: 0
          },
          Jitter: {
            count: 23998,
            min: 0.0,
            max: 0.003836,
            mean: 0.000027,
            stdev: 0.000042,
            median: 0.000014,
            madev: 0.000011,
            overflow: 0
          },
          Latency: {
            count: 24000,
            min: 0.000273,
            max: 0.004329,
            mean: 0.000647,
            stdev: 0.000042,
            median: 0.000693,
            madev: 0.000137,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 266,
            min: 0.0,
            max: 0.002139,
            mean: 0.002107,
            stdev: 0.00019,
            median: 0.002139,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 266,
            min: 0.0,
            max: 3.266331,
            mean: 1.970233,
            stdev: 0.640649,
            median: 2.035623,
            madev: 0.231379,
            overflow: 0
          }
        },
        disco_120: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 120.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 4.49751,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 57600,
            min: 0.00189,
            max: 4.49751,
            mean: 3.436002,
            stdev: 0.816452,
            median: 3.629949,
            madev: 0.15716,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2911,
            min: 0.0,
            max: 9.619607,
            mean: 7.616498,
            stdev: 1.128043,
            median: 7.722005,
            madev: 0.204514,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2911,
            min: 0.0,
            max: 0.007612,
            mean: 0.007396,
            stdev: 0.001075,
            median: 0.007611,
            madev: 3.72999999999693e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2911,
            min: 0.0,
            max: 88.140161,
            mean: 1.676942,
            stdev: 9.424749,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_180: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 180.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 4.987065,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 129600,
            min: 0.001246,
            max: 4.987065,
            mean: 4.023923,
            stdev: 0.588777,
            median: 4.109721,
            madev: 0.158487,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2910,
            min: 0.0,
            max: 16.048411,
            mean: 13.10271,
            stdev: 2.010106,
            median: 13.397593,
            madev: 0.229174,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2910,
            min: 0.0,
            max: 0.0118,
            mean: 0.011219,
            stdev: 0.001624,
            median: 0.011418,
            madev: 0.000001,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2910,
            min: 0.0,
            max: 97.029285,
            mean: 3.127996,
            stdev: 14.190376,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_240: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 240.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 6.104826,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 230400,
            min: 0.001717,
            max: 6.104826,
            mean: 4.58301,
            stdev: 0.599131,
            median: 4.667113,
            madev: 0.247931,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2910,
            min: 0.0,
            max: 22.180861,
            mean: 19.405639,
            stdev: 3.077029,
            median: 20.028359,
            madev: 0.258725,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2910,
            min: 0.0,
            max: 0.016177,
            mean: 0.015308,
            stdev: 0.002237,
            median: 0.015795,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2910,
            min: 0.0,
            max: 104.688569,
            mean: 4.660158,
            stdev: 17.905349,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_300: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 300.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 7.398244,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 360000,
            min: 0.001181,
            max: 7.398244,
            mean: 5.565733,
            stdev: 0.754626,
            median: 5.661254,
            madev: 0.420148,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2925,
            min: 0.0,
            max: 31.298537,
            mean: 27.130198,
            stdev: 4.762219,
            median: 28.237202,
            madev: 0.430712,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2925,
            min: 0.0,
            max: 0.020175,
            mean: 0.019329,
            stdev: 0.003013,
            median: 0.019982,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2925,
            min: 0.0,
            max: 106.447175,
            mean: 6.977168,
            stdev: 23.152063,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_360: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 360.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 9.984835,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 518400,
            min: 0.001168,
            max: 9.984835,
            mean: 7.018607,
            stdev: 1.037469,
            median: 7.167467,
            madev: 0.679011,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 41.436659,
            mean: 36.045379,
            stdev: 6.312709,
            median: 37.487111,
            madev: 0.711973,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 0.025316,
            mean: 0.023763,
            stdev: 0.003507,
            median: 0.024361,
            madev: 0.000381,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2940,
            min: 0.0,
            max: 110.475168,
            mean: 10.566845,
            stdev: 29.292971,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_420: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 420.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 13.885441,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 705600,
            min: 0.001443,
            max: 13.885441,
            mean: 9.993478,
            stdev: 1.46688,
            median: 10.202881,
            madev: 1.027271,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 50.808383,
            mean: 45.531602,
            stdev: 8.377716,
            median: 47.983239,
            madev: 0.518938,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 0.029317,
            mean: 0.027409,
            stdev: 0.004023,
            median: 0.028168,
            madev: 0.000191,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2940,
            min: 0.0,
            max: 111.607861,
            mean: 15.120259,
            stdev: 35.004427,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_480: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 480.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 20.394552,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 921600,
            min: 0.001225,
            max: 20.394552,
            mean: 14.957528,
            stdev: 2.170759,
            median: 15.302678,
            madev: 1.576417,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2961,
            min: 0.0,
            max: 61.389548,
            mean: 55.185544,
            stdev: 10.9711,
            median: 58.874789,
            madev: 0.7175,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2961,
            min: 0.0,
            max: 0.031979,
            mean: 0.030414,
            stdev: 0.004575,
            median: 0.0314,
            madev: 0.000191,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2961,
            min: 0.0,
            max: 111.19894,
            mean: 22.22266,
            stdev: 40.829206,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        disco_60: {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RTPS Multicast',
            Participants: 60.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 3.985746,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 14400,
            min: 0.001623,
            max: 3.985746,
            mean: 3.15052,
            stdev: 0.586748,
            median: 3.245847,
            madev: 0.107612,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 4.78121,
            mean: 3.411089,
            stdev: 0.620864,
            median: 3.389365,
            madev: 0.16646,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2940,
            min: 0.0,
            max: 0.003805,
            mean: 0.003664,
            stdev: 0.000632,
            median: 0.003805,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2940,
            min: 0.0,
            max: 32.816537,
            mean: 0.514631,
            stdev: 2.884399,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-relay_100': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 100.0
          },
          Errors: 400,
          'Max Discovery Time Delta': 93.00386,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 5116,
            min: 0.002954,
            max: 93.00386,
            mean: 68.899821,
            stdev: 24.789797,
            median: 77.965125,
            madev: 10.159216,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 7.142477,
            mean: 5.419683,
            stdev: 0.719143,
            median: 5.13709,
            madev: 1.399923,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 0.00766,
            mean: 0.006004,
            stdev: 0.000891,
            median: 0.005745,
            madev: 0.001914,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3113,
            min: 0.0,
            max: 39.790575,
            mean: 7.266247,
            stdev: 4.783938,
            median: 6.66142,
            madev: 1.535838,
            overflow: 0
          }
        },
        'disco-relay_120': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 120.0
          },
          Errors: 480,
          'Max Discovery Time Delta': 93.036758,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16706,
            min: 0.00246,
            max: 93.036758,
            mean: 65.326299,
            stdev: 23.262612,
            median: 72.943281,
            madev: 13.556032,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 9.01308,
            mean: 6.534831,
            stdev: 1.114869,
            median: 6.764912,
            madev: 0.25915,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.009575,
            mean: 0.007116,
            stdev: 0.001258,
            median: 0.00766,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 41.644562,
            mean: 8.91554,
            stdev: 4.942525,
            median: 9.254498,
            madev: 1.969028,
            overflow: 0
          }
        },
        'disco-relay_180': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 180.0
          },
          Errors: 720,
          'Max Discovery Time Delta': 92.76436,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1332,
            min: 0.002192,
            max: 92.76436,
            mean: 19.235088,
            stdev: 23.814225,
            median: 0.0381,
            madev: 0.03389,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 11.613514,
            mean: 9.635752,
            stdev: 1.755683,
            median: 10.036927,
            madev: 0.583248,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.013405,
            mean: 0.010588,
            stdev: 0.001896,
            median: 0.011489,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 37.904081,
            mean: 8.655766,
            stdev: 5.652248,
            median: 7.647543,
            madev: 3.59691,
            overflow: 0
          }
        },
        'disco-relay_20': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 20.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.896565,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1600,
            min: 0.003634,
            max: 0.896565,
            mean: 0.479097,
            stdev: 0.191368,
            median: 0.534006,
            madev: 0.160314,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2240,
            min: 0.0,
            max: 1.847855,
            mean: 1.47133,
            stdev: 0.17163,
            median: 1.517274,
            madev: 0.017432,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 2240,
            min: 0.0,
            max: 0.002066,
            mean: 0.001887,
            stdev: 0.000254,
            median: 0.001915,
            madev: 3.489999999999657e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2240,
            min: 0.0,
            max: 13.740458,
            mean: 0.137462,
            stdev: 0.730809,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-relay_240': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 240.0
          },
          Errors: 960,
          'Max Discovery Time Delta': 89.017445,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1452,
            min: 0.001519,
            max: 89.017445,
            mean: 3.741172,
            stdev: 12.416848,
            median: 0.026323,
            madev: 0.021079,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 15.711452,
            mean: 13.066961,
            stdev: 2.405218,
            median: 13.362302,
            madev: 0.937533,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.017235,
            mean: 0.014047,
            stdev: 0.002541,
            median: 0.01532,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 56.072351,
            mean: 13.275116,
            stdev: 7.05937,
            median: 12.507859,
            madev: 5.184626,
            overflow: 0
          }
        },
        'disco-relay_300': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 300.0
          },
          Errors: 1200,
          'Max Discovery Time Delta': 92.011325,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1486,
            min: 0.002169,
            max: 92.011325,
            mean: 1.612355,
            stdev: 8.123496,
            median: 0.01805,
            madev: 0.012785,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 19.902292,
            mean: 15.514511,
            stdev: 2.661673,
            median: 16.103685,
            madev: 1.12419,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.021065,
            mean: 0.017494,
            stdev: 0.003105,
            median: 0.01915,
            madev: 3.3800000000250296e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 56.806282,
            mean: 12.746297,
            stdev: 7.737307,
            median: 10.763328,
            madev: 6.491971,
            overflow: 0
          }
        },
        'disco-relay_360': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 360.0
          },
          Errors: 1440,
          'Max Discovery Time Delta': 82.718904,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1704,
            min: 0.001904,
            max: 82.718904,
            mean: 1.073698,
            stdev: 5.821384,
            median: 0.017207,
            madev: 0.011995,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 22.985737,
            mean: 18.261245,
            stdev: 3.153264,
            median: 19.068397,
            madev: 1.218687,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.024896,
            mean: 0.020948,
            stdev: 0.003778,
            median: 0.02298,
            madev: 0.000002,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 68.609188,
            mean: 14.000018,
            stdev: 7.675746,
            median: 12.441068,
            madev: 7.406259,
            overflow: 0
          }
        },
        'disco-relay_40': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 40.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 3.223234,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 6400,
            min: 0.002994,
            max: 3.223234,
            mean: 2.231204,
            stdev: 0.64143,
            median: 2.38089,
            madev: 0.351048,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 3.269888,
            mean: 2.044149,
            stdev: 0.265576,
            median: 1.587642,
            madev: 0.094391,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 0.00383,
            mean: 0.002518,
            stdev: 0.000375,
            median: 0.001915,
            madev: 3.730000000001267e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3113,
            min: 0.0,
            max: 28.311688,
            mean: 0.34268,
            stdev: 1.741199,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-relay_420': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 420.0
          },
          Errors: 1680,
          'Max Discovery Time Delta': 59.126066,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1920,
            min: 0.001527,
            max: 59.126066,
            mean: 0.399993,
            stdev: 2.785967,
            median: 0.016869,
            madev: 0.011432,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 27.105358,
            mean: 21.24318,
            stdev: 3.645437,
            median: 22.712874,
            madev: 1.476137,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.028726,
            mean: 0.024392,
            stdev: 0.00441,
            median: 0.02681,
            madev: 0.001914,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 74.011843,
            mean: 16.687783,
            stdev: 9.70604,
            median: 14.271139,
            madev: 7.470131,
            overflow: 0
          }
        },
        'disco-relay_480': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 480.0
          },
          Errors: 1920,
          'Max Discovery Time Delta': 69.438104,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 2093,
            min: 0.001266,
            max: 69.438104,
            mean: 0.516289,
            stdev: 3.862069,
            median: 0.016616,
            madev: 0.011079,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 28.71511,
            mean: 23.839958,
            stdev: 4.063206,
            median: 25.356996,
            madev: 1.185735,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3142,
            min: 0.0,
            max: 0.032555,
            mean: 0.027837,
            stdev: 0.005125,
            median: 0.03064,
            madev: 0.001914,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3142,
            min: 0.0,
            max: 66.416743,
            mean: 17.995179,
            stdev: 9.555348,
            median: 16.635517,
            madev: 8.474187,
            overflow: 0
          }
        },
        'disco-relay_60': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 60.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 8.706892,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 14400,
            min: 0.003082,
            max: 8.706892,
            mean: 6.574741,
            stdev: 1.428179,
            median: 6.798852,
            madev: 1.009688,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 5.118169,
            mean: 3.13981,
            stdev: 0.404821,
            median: 3.23481,
            madev: 0.09184,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 0.005744,
            mean: 0.003679,
            stdev: 0.000534,
            median: 0.003829,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3113,
            min: 0.0,
            max: 33.072916,
            mean: 0.938787,
            stdev: 3.040515,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-relay_80': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'RtpsRelay',
            Participants: 80.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 26.955423,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 25600,
            min: 0.002118,
            max: 26.955423,
            mean: 19.5468,
            stdev: 4.894507,
            median: 20.708945,
            madev: 3.424445,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 5.272299,
            mean: 4.305568,
            stdev: 0.57808,
            median: 4.992739,
            madev: 0.217269,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3113,
            min: 0.0,
            max: 0.005745,
            mean: 0.00484,
            stdev: 0.000714,
            median: 0.005744,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3113,
            min: 0.0,
            max: 36.031331,
            mean: 2.496988,
            stdev: 4.636368,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-repo_120': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 120.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 11.309554,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 57600,
            min: 0.003405,
            max: 11.309554,
            mean: 1.889917,
            stdev: 2.240724,
            median: 0.114542,
            madev: 0.104057,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3331,
            min: 0.0,
            max: 9.019246,
            mean: 6.352176,
            stdev: 1.317704,
            median: 6.855477,
            madev: 0.167523,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3331,
            min: 0.0,
            max: 0.010712,
            mean: 0.007682,
            stdev: 0.001664,
            median: 0.008569,
            madev: 0.000001,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3331,
            min: 0.0,
            max: 37.434554,
            mean: 1.347526,
            stdev: 3.986879,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-repo_180': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 180.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 19.651719,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 129600,
            min: 0.003706,
            max: 19.651719,
            mean: 3.367487,
            stdev: 3.997579,
            median: 0.234536,
            madev: 0.218944,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3560,
            min: 0.0,
            max: 13.071263,
            mean: 9.472252,
            stdev: 2.436419,
            median: 10.871141,
            madev: 0.231513,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3560,
            min: 0.0,
            max: 0.015002,
            mean: 0.010947,
            stdev: 0.002918,
            median: 0.012855,
            madev: 0.000004,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3560,
            min: 0.0,
            max: 56.975946,
            mean: 2.72615,
            stdev: 6.114587,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-repo_240': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 240.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 34.373394,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 230400,
            min: 0.004019,
            max: 34.373394,
            mean: 5.341755,
            stdev: 6.660756,
            median: 0.294668,
            madev: 0.278332,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3842,
            min: 0.0,
            max: 17.538261,
            mean: 12.42649,
            stdev: 3.886131,
            median: 15.073461,
            madev: 2.16717,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3842,
            min: 0.0,
            max: 0.019292,
            mean: 0.013845,
            stdev: 0.004411,
            median: 0.017141,
            madev: 0.002144,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3842,
            min: 0.0,
            max: 81.142242,
            mean: 4.424267,
            stdev: 8.042471,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'disco-repo_300': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 300.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 51.728634,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 360000,
            min: 0.003905,
            max: 51.728634,
            mean: 8.196633,
            stdev: 10.226041,
            median: 0.337226,
            madev: 0.318846,
            overflow: 0
          },
          'Memory Utilization': {
            count: 4335,
            min: 0.0,
            max: 22.731051,
            mean: 14.8999,
            stdev: 5.802589,
            median: 16.50421,
            madev: 4.018002,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 4335,
            min: 0.0,
            max: 0.023584,
            mean: 0.015884,
            stdev: 0.006232,
            median: 0.018788,
            madev: 0.003523,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 4335,
            min: 0.0,
            max: 73.077361,
            mean: 6.200683,
            stdev: 8.924418,
            median: 2.544529,
            madev: 2.544529,
            overflow: 0
          }
        },
        'disco-repo_360': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 360.0
          },
          Errors: 1278,
          'Max Discovery Time Delta': 46.111448,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 374544,
            min: 0.004089,
            max: 46.111448,
            mean: 7.413417,
            stdev: 9.319324,
            median: 0.363396,
            madev: 0.344919,
            overflow: 0
          },
          'Memory Utilization': {
            count: 4234,
            min: 0.0,
            max: 26.642544,
            mean: 15.807498,
            stdev: 6.155189,
            median: 16.822249,
            madev: 5.152822,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 4234,
            min: 0.0,
            max: 0.027863,
            mean: 0.016818,
            stdev: 0.006629,
            median: 0.019292,
            madev: 0.004291,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 4234,
            min: 0.0,
            max: 79.251705,
            mean: 6.470963,
            stdev: 9.641981,
            median: 1.522852,
            madev: 1.522852,
            overflow: 0
          }
        },
        'disco-repo_420': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 420.0
          },
          Errors: 1353,
          'Max Discovery Time Delta': 47.703687,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 386884,
            min: 0.00435,
            max: 47.703687,
            mean: 7.67535,
            stdev: 9.703815,
            median: 0.355599,
            madev: 0.336782,
            overflow: 0
          },
          'Memory Utilization': {
            count: 4277,
            min: 0.0,
            max: 29.065676,
            mean: 15.926922,
            stdev: 6.143165,
            median: 17.769349,
            madev: 4.721259,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 4277,
            min: 0.0,
            max: 0.030016,
            mean: 0.016906,
            stdev: 0.006499,
            median: 0.019294,
            madev: 0.004288,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 4277,
            min: 0.0,
            max: 79.358099,
            mean: 6.872019,
            stdev: 10.052748,
            median: 2.02148,
            madev: 2.02148,
            overflow: 0
          }
        },
        'disco-repo_480': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 480.0
          },
          Errors: 1242,
          'Max Discovery Time Delta': 42.162214,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 258064,
            min: 0.003233,
            max: 42.162214,
            mean: 6.646811,
            stdev: 8.253579,
            median: 0.285279,
            madev: 0.266893,
            overflow: 0
          },
          'Memory Utilization': {
            count: 4036,
            min: 0.0,
            max: 27.33347,
            mean: 13.393389,
            stdev: 4.54162,
            median: 14.506157,
            madev: 4.622084,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 4036,
            min: 0.0,
            max: 0.030002,
            mean: 0.014778,
            stdev: 0.005095,
            median: 0.016263,
            madev: 0.005173,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 4036,
            min: 0.0,
            max: 71.49946,
            mean: 5.110125,
            stdev: 8.574047,
            median: 1.005025,
            madev: 1.005025,
            overflow: 0
          }
        },
        'disco-repo_60': {
          scenario_parameters: {
            Base: 'disco',
            Config: 'InfoRepo',
            Participants: 60.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 3.899388,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 14400,
            min: 0.003764,
            max: 3.899388,
            mean: 0.694371,
            stdev: 0.794661,
            median: 0.062347,
            madev: 0.054247,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3165,
            min: 0.0,
            max: 4.887931,
            mean: 3.139256,
            stdev: 0.454319,
            median: 3.249267,
            madev: 0.02381,
            overflow: 0
          },
          Jitter: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Latency: {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 3165,
            min: 0.0,
            max: 0.006425,
            mean: 0.004059,
            stdev: 0.000663,
            median: 0.004283,
            madev: 6.750000000003281e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3165,
            min: 0.0,
            max: 25.0,
            mean: 0.387815,
            stdev: 1.887289,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_1024': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 1024.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.358731,
          'Round Trip Throughput': {
            count: 99,
            min: 1110.213207,
            max: 1111.983489,
            mean: 1111.906432,
            stdev: 0.209569,
            median: 1111.964046,
            madev: 0.015482,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 4.045000000000264e-7,
            max: 0.002958,
            mean: 0.000092,
            stdev: 0.000418,
            median: 0.000011,
            madev: 0.000007,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000788,
            max: 0.003792,
            mean: 0.000895,
            stdev: 0.000305,
            median: 0.000855,
            madev: 0.000013,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 1110.918127,
            max: 1112.602535,
            mean: 1111.986219,
            stdev: 0.105727,
            median: 1111.991499,
            madev: 0.020026,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.322576,
            max: 0.358731,
            mean: 0.345839,
            stdev: 0.0,
            median: 0.351024,
            madev: 0.004353,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.433512,
            mean: 1.36413,
            stdev: 0.123122,
            median: 1.318925,
            madev: 0.107571,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 4.040000000000185e-7,
            max: 0.005768,
            mean: 0.000095,
            stdev: 0.000572,
            median: 0.000019,
            madev: 0.000011,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: -0.000111,
            max: 0.006441,
            mean: 0.000719,
            stdev: 0.000457,
            median: 0.000698,
            madev: 0.000255,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002116,
            mean: 0.002096,
            stdev: 0.00019,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.25,
            mean: 0.069612,
            stdev: 0.283283,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_1048576': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 1048576.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.3497,
          'Round Trip Throughput': {
            count: 99,
            min: 1008266.14131,
            max: 1048312.911439,
            mean: 1046743.261934,
            stdev: 4638.338696,
            median: 1047976.321283,
            madev: 277.032941,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000008,
            max: 0.005143,
            mean: 0.001215,
            stdev: 0.000893,
            median: 0.001158,
            madev: 0.000165,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.0126,
            max: 0.022741,
            mean: 0.016983,
            stdev: 0.001121,
            median: 0.017221,
            madev: 0.000624,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 1027898.894319,
            max: 1048633.663545,
            mean: 1047840.716129,
            stdev: 2171.744214,
            median: 1048377.408574,
            madev: 120.204874,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.320567,
            max: 0.3497,
            mean: 0.337376,
            stdev: 0.0,
            median: 0.339619,
            madev: 0.008219,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.988804,
            mean: 1.838672,
            stdev: 0.181673,
            median: 1.824045,
            madev: 0.135208,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.000003,
            max: 0.009698,
            mean: 0.001578,
            stdev: 0.001163,
            median: 0.001998,
            madev: 0.00102,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.008813,
            max: 0.022518,
            mean: 0.01668,
            stdev: 0.001429,
            median: 0.016823,
            madev: 0.000664,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002125,
            mean: 0.002099,
            stdev: 0.00019,
            median: 0.002116,
            madev: 0.000005,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.25,
            mean: 0.228187,
            stdev: 0.309856,
            median: 0.25,
            madev: 0.001256,
            overflow: 0
          }
        },
        'echo-rtps_16384': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 16384.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.348596,
          'Round Trip Throughput': {
            count: 99,
            min: 16434.635232,
            max: 16471.651665,
            mean: 16470.046772,
            stdev: 4.524504,
            median: 16471.287712,
            madev: 0.295767,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 3.394999999999787e-7,
            max: 0.000689,
            mean: 0.000064,
            stdev: 0.00014,
            median: 0.000016,
            madev: 0.000014,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.001055,
            max: 0.001815,
            mean: 0.00111,
            stdev: 0.000123,
            median: 0.001072,
            madev: 0.000008,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 16457.387173,
            max: 16471.945987,
            mean: 16471.388211,
            stdev: 1.528428,
            median: 16471.808339,
            madev: 0.097623,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.319427,
            max: 0.348596,
            mean: 0.336751,
            stdev: 0.0,
            median: 0.33949,
            madev: 0.007564,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.446693,
            mean: 1.430532,
            stdev: 0.129,
            median: 1.437977,
            madev: 0.005633,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.0,
            max: 0.001285,
            mean: 0.000065,
            stdev: 0.000182,
            median: 0.00002,
            madev: 0.000015,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000841,
            max: 0.002154,
            mean: 0.000924,
            stdev: 0.000147,
            median: 0.000897,
            madev: 0.000025,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002117,
            mean: 0.002097,
            stdev: 0.00019,
            median: 0.002116,
            madev: 4.420000000002374e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.266331,
            mean: 0.072669,
            stdev: 0.28521,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_256': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 256.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.366863,
          'Round Trip Throughput': {
            count: 99,
            min: 343.446727,
            max: 343.994392,
            mean: 343.969289,
            stdev: 0.065848,
            median: 343.987533,
            madev: 0.005225,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 1.880000000000328e-7,
            max: 0.000783,
            mean: 0.000078,
            stdev: 0.000104,
            median: 0.000043,
            madev: 0.000038,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000827,
            max: 0.00165,
            mean: 0.000923,
            stdev: 0.000105,
            median: 0.000883,
            madev: 0.000023,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 343.68957,
            max: 344.131318,
            mean: 343.991153,
            stdev: 0.028928,
            median: 343.993453,
            madev: 0.002258,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.323355,
            max: 0.366863,
            mean: 0.35023,
            stdev: 0.0,
            median: 0.355351,
            madev: 0.006734,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.427134,
            mean: 1.415309,
            stdev: 0.127614,
            median: 1.426497,
            madev: 0.000637,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 4.080000000072914e-7,
            max: 0.002321,
            mean: 0.00013,
            stdev: 0.000296,
            median: 0.000025,
            madev: 0.000019,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: -0.001435,
            max: 0.002962,
            mean: 0.000726,
            stdev: 0.000883,
            median: 0.000781,
            madev: 0.00084,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002116,
            mean: 0.002096,
            stdev: 0.00019,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 5.154639,
            mean: 0.083705,
            stdev: 0.416681,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_262144': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 262144.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.350741,
          'Round Trip Throughput': {
            count: 99,
            min: 259370.254892,
            max: 262207.486128,
            mean: 262096.10146,
            stdev: 327.90966,
            median: 262181.897328,
            madev: 21.324954,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000036,
            max: 0.001193,
            mean: 0.000295,
            stdev: 0.000152,
            median: 0.000268,
            madev: 0.000079,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.004451,
            max: 0.006782,
            mean: 0.004852,
            stdev: 0.000276,
            median: 0.004848,
            madev: 0.000143,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 260784.035759,
            max: 262226.681995,
            mean: 262177.796472,
            stdev: 143.40447,
            median: 262213.531303,
            madev: 8.961535,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.321325,
            max: 0.350741,
            mean: 0.34114,
            stdev: 0.0,
            median: 0.346248,
            madev: 0.004334,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.563194,
            mean: 1.513432,
            stdev: 0.137255,
            median: 1.516849,
            madev: 0.02381,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 9.160000000001112e-7,
            max: 0.001489,
            mean: 0.000406,
            stdev: 0.000188,
            median: 0.000398,
            madev: 0.000239,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.003923,
            max: 0.006594,
            mean: 0.004679,
            stdev: 0.000351,
            median: 0.004715,
            madev: 0.000163,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002119,
            mean: 0.002097,
            stdev: 0.00019,
            median: 0.002116,
            madev: 0.000001,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.25,
            mean: 0.103985,
            stdev: 0.291891,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_4096': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 4096.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.350186,
          'Round Trip Throughput': {
            count: 99,
            min: 4176.472693,
            max: 4183.929656,
            mean: 4183.611913,
            stdev: 0.880053,
            median: 4183.848625,
            madev: 0.061076,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.0,
            max: 0.000683,
            mean: 0.000031,
            stdev: 0.000072,
            median: 0.000012,
            madev: 0.000009,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000846,
            max: 0.001644,
            mean: 0.000933,
            stdev: 0.00008,
            median: 0.000921,
            madev: 0.000025,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 4180.810706,
            max: 4184.088617,
            mean: 4183.919908,
            stdev: 0.264392,
            median: 4183.971729,
            madev: 0.033481,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.319881,
            max: 0.350186,
            mean: 0.338968,
            stdev: 0.0,
            median: 0.342903,
            madev: 0.005733,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.431386,
            mean: 1.417207,
            stdev: 0.127785,
            median: 1.426071,
            madev: 0.005314,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.0,
            max: 0.000778,
            mean: 0.00003,
            stdev: 0.00007,
            median: 0.000013,
            madev: 0.000009,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000518,
            max: 0.0015,
            mean: 0.000769,
            stdev: 0.000087,
            median: 0.000778,
            madev: 0.00009,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002116,
            mean: 0.002096,
            stdev: 0.00019,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.266331,
            mean: 0.068697,
            stdev: 0.284092,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-rtps_4194304': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 4194304.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.349925,
          'Round Trip Throughput': {
            count: 99,
            min: 3629547.804209,
            max: 4188579.850265,
            mean: 4164514.217936,
            stdev: 66242.678134,
            median: 4182751.465172,
            madev: 4809.838611,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000013,
            max: 0.007974,
            mean: 0.001284,
            stdev: 0.001451,
            median: 0.000575,
            madev: 0.000525,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.065556,
            max: 0.081606,
            mean: 0.068918,
            stdev: 0.00217,
            median: 0.068203,
            madev: 0.000643,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 3888124.283035,
            max: 4192054.429859,
            mean: 4180170.268402,
            stdev: 34170.728304,
            median: 4189290.94924,
            madev: 2164.606719,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.320803,
            max: 0.349925,
            mean: 0.337435,
            stdev: 0.0,
            median: 0.339505,
            madev: 0.008097,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 3.889171,
            mean: 3.232201,
            stdev: 0.423221,
            median: 3.047941,
            madev: 0.581866,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 3.069999999910644e-7,
            max: 0.010246,
            mean: 0.001531,
            stdev: 0.00197,
            median: 0.000558,
            madev: 0.000469,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.06271,
            max: 0.081873,
            mean: 0.06778,
            stdev: 0.002841,
            median: 0.067678,
            madev: 0.001463,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002152,
            mean: 0.002108,
            stdev: 0.000191,
            median: 0.002116,
            madev: 0.000023,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.02267,
            mean: 0.770957,
            stdev: 0.433464,
            median: 0.755667,
            madev: 0.249357,
            overflow: 0
          }
        },
        'echo-rtps_65536': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'rtps',
            Bytes: 65536.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.351388,
          'Round Trip Throughput': {
            count: 99,
            min: 65389.163906,
            max: 65621.590877,
            mean: 65612.071239,
            stdev: 27.103611,
            median: 65619.352578,
            madev: 1.844478,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 1.7549999999999857e-7,
            max: 0.000795,
            mean: 0.000107,
            stdev: 0.000114,
            median: 0.000054,
            madev: 0.000046,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.001635,
            max: 0.002652,
            mean: 0.001846,
            stdev: 0.000138,
            median: 0.00181,
            madev: 0.0001,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 65514.734198,
            max: 65623.407091,
            mean: 65619.745677,
            stdev: 10.209004,
            median: 65622.276477,
            madev: 0.678015,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.321677,
            max: 0.351388,
            mean: 0.341666,
            stdev: 0.0,
            median: 0.3468,
            madev: 0.004465,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.476456,
            mean: 1.395843,
            stdev: 0.126176,
            median: 1.344223,
            madev: 0.082485,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 2.360000000000296e-7,
            max: 0.001068,
            mean: 0.000098,
            stdev: 0.00011,
            median: 0.000063,
            madev: 0.000045,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.001374,
            max: 0.002695,
            mean: 0.001673,
            stdev: 0.000136,
            median: 0.001628,
            madev: 0.000102,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002117,
            mean: 0.002097,
            stdev: 0.00019,
            median: 0.002116,
            madev: 4.890000000002184e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.007518,
            mean: 0.076711,
            stdev: 0.274992,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_1024': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 1024.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.347397,
          'Round Trip Throughput': {
            count: 99,
            min: 1110.289588,
            max: 1111.984443,
            mean: 1111.91415,
            stdev: 0.19697,
            median: 1111.967459,
            madev: 0.013384,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 2.164999999999936e-7,
            max: 0.000525,
            mean: 0.000027,
            stdev: 0.000055,
            median: 0.000017,
            madev: 0.000009,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000738,
            max: 0.001335,
            mean: 0.000815,
            stdev: 0.000057,
            median: 0.000808,
            madev: 0.000011,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 1111.372675,
            max: 1111.999199,
            mean: 1111.980266,
            stdev: 0.053532,
            median: 1111.992845,
            madev: 0.004047,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.32913,
            max: 0.347397,
            mean: 0.338329,
            stdev: 0.0,
            median: 0.338396,
            madev: 0.007142,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.449669,
            mean: 1.415171,
            stdev: 0.132195,
            median: 1.435851,
            madev: 0.013818,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.0,
            max: 0.000765,
            mean: 0.000024,
            stdev: 0.000061,
            median: 0.000009,
            madev: 0.000006,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000565,
            max: 0.001367,
            mean: 0.000625,
            stdev: 0.000061,
            median: 0.000625,
            madev: 0.000024,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002138,
            mean: 0.002117,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.015075,
            mean: 0.050557,
            stdev: 0.26807,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_1048576': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 1048576.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.349751,
          'Round Trip Throughput': {
            count: 99,
            min: 1029288.383157,
            max: 1048527.825329,
            mean: 1047867.512041,
            stdev: 2130.452007,
            median: 1048379.252164,
            madev: 123.859361,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 6.005000000005103e-7,
            max: 0.006214,
            mean: 0.000352,
            stdev: 0.000687,
            median: 0.00017,
            madev: 0.000125,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.006273,
            max: 0.015679,
            mean: 0.006898,
            stdev: 0.000966,
            median: 0.006706,
            madev: 0.000154,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 1036790.645533,
            max: 1049408.993284,
            mean: 1048488.069978,
            stdev: 935.082165,
            median: 1048596.244987,
            madev: 109.895589,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.329388,
            max: 0.349751,
            mean: 0.338642,
            stdev: 0.0,
            median: 0.337714,
            madev: 0.006388,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.959041,
            mean: 1.830959,
            stdev: 0.175045,
            median: 1.761118,
            madev: 0.120752,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.000004,
            max: 0.008515,
            mean: 0.000408,
            stdev: 0.000754,
            median: 0.000219,
            madev: 0.000148,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.005775,
            max: 0.015363,
            mean: 0.006622,
            stdev: 0.00097,
            median: 0.006461,
            madev: 0.000353,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002144,
            mean: 0.00212,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.000005,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.274559,
            mean: 0.168678,
            stdev: 0.312903,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_16384': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 16384.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.352647,
          'Round Trip Throughput': {
            count: 99,
            min: 16437.623291,
            max: 16471.647728,
            mean: 16470.084604,
            stdev: 4.189168,
            median: 16471.308676,
            madev: 0.290979,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000001,
            max: 0.000485,
            mean: 0.000087,
            stdev: 0.00009,
            median: 0.000053,
            madev: 0.000037,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000966,
            max: 0.001583,
            mean: 0.001157,
            stdev: 0.000112,
            median: 0.001155,
            madev: 0.000079,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 16457.060757,
            max: 16471.97989,
            mean: 16471.400044,
            stdev: 1.423362,
            median: 16471.783264,
            madev: 0.114831,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.327168,
            max: 0.352647,
            mean: 0.340038,
            stdev: 0.0,
            median: 0.340169,
            madev: 0.007448,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.51536,
            mean: 1.485945,
            stdev: 0.1356,
            median: 1.51366,
            madev: 0.0017,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 5.909999999998729e-7,
            max: 0.000634,
            mean: 0.000095,
            stdev: 0.00011,
            median: 0.000044,
            madev: 0.000037,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.00075,
            max: 0.001458,
            mean: 0.000985,
            stdev: 0.000133,
            median: 0.000993,
            madev: 0.000126,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002138,
            mean: 0.002117,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.266331,
            mean: 0.053566,
            stdev: 0.290454,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_256': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 256.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.356466,
          'Round Trip Throughput': {
            count: 99,
            min: 343.505355,
            max: 343.995192,
            mean: 343.974619,
            stdev: 0.057128,
            median: 343.990162,
            madev: 0.004161,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.0,
            max: 0.000476,
            mean: 0.000021,
            stdev: 0.00005,
            median: 0.00001,
            madev: 0.000007,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000716,
            max: 0.001234,
            mean: 0.00076,
            stdev: 0.000054,
            median: 0.000753,
            madev: 0.000018,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 343.836512,
            max: 343.999392,
            mean: 343.994039,
            stdev: 0.01443,
            median: 343.997453,
            madev: 0.001223,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.327707,
            max: 0.356466,
            mean: 0.342482,
            stdev: 0.0,
            median: 0.342876,
            madev: 0.007048,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.769621,
            mean: 1.573919,
            stdev: 0.147445,
            median: 1.450094,
            madev: 0.210041,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 1.0500000000002697e-7,
            max: 0.000618,
            mean: 0.000021,
            stdev: 0.000051,
            median: 0.00001,
            madev: 0.000006,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000459,
            max: 0.001275,
            mean: 0.000588,
            stdev: 0.000061,
            median: 0.000586,
            madev: 0.000037,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002138,
            mean: 0.002117,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.508771,
            mean: 0.050468,
            stdev: 0.301012,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_262144': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 262144.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.352311,
          'Round Trip Throughput': {
            count: 99,
            min: 260508.949262,
            max: 262218.825542,
            mean: 262147.865378,
            stdev: 201.270889,
            median: 262200.10366,
            madev: 13.983127,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000002,
            max: 0.001704,
            mean: 0.00037,
            stdev: 0.000375,
            median: 0.000246,
            madev: 0.000166,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.002397,
            max: 0.004877,
            mean: 0.002979,
            stdev: 0.000453,
            median: 0.002867,
            madev: 0.000208,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 261194.424216,
            max: 262244.513914,
            mean: 262206.565911,
            stdev: 87.253472,
            median: 262224.481475,
            madev: 8.830455,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.325987,
            max: 0.352311,
            mean: 0.339591,
            stdev: 0.0,
            median: 0.340033,
            madev: 0.007181,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.611452,
            mean: 1.565609,
            stdev: 0.14258,
            median: 1.552777,
            madev: 0.050384,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.000002,
            max: 0.00197,
            mean: 0.000449,
            stdev: 0.000479,
            median: 0.000256,
            madev: 0.000225,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.001981,
            max: 0.004931,
            mean: 0.002786,
            stdev: 0.000548,
            median: 0.002585,
            madev: 0.00029,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002139,
            mean: 0.002118,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.000001,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.508771,
            mean: 0.080786,
            stdev: 0.308903,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_4096': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 4096.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.348833,
          'Round Trip Throughput': {
            count: 99,
            min: 4177.759175,
            max: 4183.941282,
            mean: 4183.682742,
            stdev: 0.730298,
            median: 4183.88068,
            madev: 0.048706,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 2.2300000000004177e-7,
            max: 0.000532,
            mean: 0.000026,
            stdev: 0.000058,
            median: 0.000017,
            madev: 0.000008,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.000781,
            max: 0.001402,
            mean: 0.00082,
            stdev: 0.000063,
            median: 0.000811,
            madev: 0.00001,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 4181.857755,
            max: 4184.226759,
            mean: 4183.949717,
            stdev: 0.180119,
            median: 4183.979305,
            madev: 0.026507,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.328107,
            max: 0.348833,
            mean: 0.338318,
            stdev: 0.0,
            median: 0.338165,
            madev: 0.007348,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.557029,
            mean: 1.47615,
            stdev: 0.135992,
            median: 1.436488,
            madev: 0.014668,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.0,
            max: 0.000706,
            mean: 0.000026,
            stdev: 0.000056,
            median: 0.00001,
            madev: 0.000008,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000519,
            max: 0.001311,
            mean: 0.000636,
            stdev: 0.000063,
            median: 0.000661,
            madev: 0.000083,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002138,
            mean: 0.002117,
            stdev: 0.000192,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.274559,
            mean: 0.051591,
            stdev: 0.279614,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'echo-tcp_4194304': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 4194304.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.34955,
          'Round Trip Throughput': {
            count: 99,
            min: 3932644.203629,
            max: 4192155.276483,
            mean: 4181306.464479,
            stdev: 30128.972465,
            median: 4189751.748278,
            madev: 1968.543244,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000004,
            max: 0.012425,
            mean: 0.001489,
            stdev: 0.001654,
            median: 0.00097,
            madev: 0.000745,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.026323,
            max: 0.045784,
            mean: 0.029314,
            stdev: 0.00311,
            median: 0.028096,
            madev: 0.001427,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 4041626.126628,
            max: 4194200.831291,
            mean: 4189670.166261,
            stdev: 13366.913642,
            median: 4192595.458805,
            madev: 1327.803916,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.328559,
            max: 0.34955,
            mean: 0.338855,
            stdev: 0.0,
            median: 0.338655,
            madev: 0.007074,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 3.455056,
            mean: 2.807525,
            stdev: 0.368138,
            median: 2.582151,
            madev: 0.235127,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.0,
            max: 0.017023,
            mean: 0.00172,
            stdev: 0.002246,
            median: 0.000754,
            madev: 0.000618,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.023775,
            max: 0.04326,
            mean: 0.028149,
            stdev: 0.003378,
            median: 0.027198,
            madev: 0.002453,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002161,
            mean: 0.002129,
            stdev: 0.000193,
            median: 0.002138,
            madev: 0.000023,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.02267,
            mean: 0.561067,
            stdev: 0.364606,
            median: 0.502512,
            madev: 0.249367,
            overflow: 0
          }
        },
        'echo-tcp_65536': {
          scenario_parameters: {
            Base: 'echo',
            Config: 'tcp',
            Bytes: 65536.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.346726,
          'Round Trip Throughput': {
            count: 99,
            min: 65437.311994,
            max: 65622.434495,
            mean: 65614.725374,
            stdev: 21.862353,
            median: 65620.607387,
            madev: 1.316328,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 99,
            min: 0.000001,
            max: 0.000945,
            mean: 0.000097,
            stdev: 0.000113,
            median: 0.000062,
            madev: 0.000043,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 100,
            min: 0.001171,
            max: 0.00248,
            mean: 0.001415,
            stdev: 0.000145,
            median: 0.001417,
            madev: 0.000078,
            overflow: 0
          },
          Throughput: {
            count: 198,
            min: 65542.387209,
            max: 65628.108549,
            mean: 65622.27079,
            stdev: 6.769649,
            median: 65623.521343,
            madev: 0.869325,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 4,
            min: 0.330554,
            max: 0.346726,
            mean: 0.338275,
            stdev: 0.0,
            median: 0.337911,
            madev: 0.007129,
            overflow: 0
          },
          'Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 1.565957,
            mean: 1.471229,
            stdev: 0.137311,
            median: 1.49729,
            madev: 0.059525,
            overflow: 0
          },
          Jitter: {
            count: 198,
            min: 0.000001,
            max: 0.000939,
            mean: 0.000119,
            stdev: 0.000127,
            median: 0.00008,
            madev: 0.000057,
            overflow: 0
          },
          Latency: {
            count: 200,
            min: 0.000825,
            max: 0.002402,
            mean: 0.001244,
            stdev: 0.000168,
            median: 0.001256,
            madev: 0.000136,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 248,
            min: 0.0,
            max: 0.002138,
            mean: 0.002117,
            stdev: 0.000192,
            median: 0.002138,
            madev: 4.310000000003894e-7,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 248,
            min: 0.0,
            max: 3.015075,
            mean: 0.054572,
            stdev: 0.280003,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_1048576_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 1048576.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.550868,
          'Round Trip Throughput': {
            count: 144,
            min: 298122.410353,
            max: 1043918.551525,
            mean: 944587.386902,
            stdev: 125271.288104,
            median: 978340.280531,
            madev: 50901.776437,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000011,
            max: 0.499612,
            mean: 0.084031,
            stdev: 0.120821,
            median: 0.007747,
            madev: 0.0056,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.018249,
            max: 1.758328,
            mean: 0.227236,
            stdev: 0.228321,
            median: 0.238741,
            madev: 0.177977,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 302552.350932,
            max: 1046748.810804,
            mean: 995795.516737,
            stdev: 87149.987914,
            median: 1035704.567811,
            madev: 9518.72805,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.114736,
            max: 0.550868,
            mean: 0.376692,
            stdev: 0.088388,
            median: 0.429008,
            madev: 0.120442,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 2.480319,
            mean: 1.932841,
            stdev: 0.265071,
            median: 1.937995,
            madev: 0.05336,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.000008,
            max: 0.998341,
            mean: 0.085127,
            stdev: 0.170843,
            median: 0.004933,
            madev: 0.00412,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.016265,
            max: 3.465152,
            mean: 0.226795,
            stdev: 0.316744,
            median: 0.043093,
            madev: 0.020719,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002125,
            mean: 0.002078,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 6.783919,
            mean: 0.410773,
            stdev: 0.961531,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_1048576_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 1048576.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.556412,
          'Round Trip Throughput': {
            count: 36,
            min: 946314.482726,
            max: 1044586.30219,
            mean: 1023899.35675,
            stdev: 24138.645229,
            median: 1033225.882776,
            madev: 7123.206309,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000064,
            max: 0.00513,
            mean: 0.001545,
            stdev: 0.001274,
            median: 0.001007,
            madev: 0.00065,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.016203,
            max: 0.057139,
            mean: 0.038861,
            stdev: 0.01268,
            median: 0.043699,
            madev: 0.003639,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 984547.377269,
            max: 1047103.589244,
            mean: 1037011.521639,
            stdev: 12040.544503,
            median: 1041530.219199,
            madev: 3763.430873,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.018513,
            max: 0.556412,
            mean: 0.307319,
            stdev: 0.11069,
            median: 0.32432,
            madev: 0.020695,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.938207,
            mean: 1.811831,
            stdev: 0.24448,
            median: 1.882721,
            madev: 0.007015,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.000021,
            max: 0.008095,
            mean: 0.001731,
            stdev: 0.001521,
            median: 0.00129,
            madev: 0.00085,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.015007,
            max: 0.065283,
            mean: 0.038472,
            stdev: 0.008241,
            median: 0.042478,
            madev: 0.004312,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002125,
            mean: 0.002079,
            stdev: 0.000264,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 3.526448,
            mean: 0.180748,
            stdev: 0.501157,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_256_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 256.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.937254,
          'Round Trip Throughput': {
            count: 144,
            min: 342.305048,
            max: 343.936416,
            mean: 343.6657,
            stdev: 0.341752,
            median: 343.786832,
            madev: 0.085873,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 1.0700000000005845e-7,
            max: 0.002401,
            mean: 0.000435,
            stdev: 0.000527,
            median: 0.000233,
            madev: 0.000209,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.000743,
            max: 0.004514,
            mean: 0.001839,
            stdev: 0.00073,
            median: 0.001723,
            madev: 0.000438,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 342.968341,
            max: 344.084686,
            mean: 343.888071,
            stdev: 0.152164,
            median: 343.935834,
            madev: 0.035462,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.251981,
            max: 0.937254,
            mean: 0.531747,
            stdev: 0.136068,
            median: 0.427956,
            madev: 0.15979,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 1.699891,
            mean: 1.467207,
            stdev: 0.185025,
            median: 1.476243,
            madev: 0.001913,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.0,
            max: 0.004733,
            mean: 0.000447,
            stdev: 0.00071,
            median: 0.00012,
            madev: 0.000107,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.000486,
            max: 0.007085,
            mean: 0.001634,
            stdev: 0.000929,
            median: 0.001055,
            madev: 0.000236,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002116,
            mean: 0.002077,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 8.115183,
            mean: 0.160419,
            stdev: 0.870762,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_256_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 256.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.552783,
          'Round Trip Throughput': {
            count: 36,
            min: 342.997863,
            max: 343.935339,
            mean: 343.766185,
            stdev: 0.221807,
            median: 343.864634,
            madev: 0.055554,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 1.5799999999988566e-7,
            max: 0.000946,
            mean: 0.00025,
            stdev: 0.000303,
            median: 0.000094,
            madev: 0.000079,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.000851,
            max: 0.002052,
            mean: 0.001197,
            stdev: 0.000332,
            median: 0.001088,
            madev: 0.000125,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 343.515607,
            max: 343.991923,
            mean: 343.926466,
            stdev: 0.083262,
            median: 343.958482,
            madev: 0.01957,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.101586,
            max: 0.552783,
            mean: 0.307206,
            stdev: 0.05,
            median: 0.327886,
            madev: 0.095448,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.443717,
            mean: 1.414037,
            stdev: 0.178156,
            median: 1.436914,
            madev: 0.003614,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 1.320000000000184e-7,
            max: 0.001672,
            mean: 0.000251,
            stdev: 0.000403,
            median: 0.000055,
            madev: 0.000049,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.00064,
            max: 0.002629,
            mean: 0.001013,
            stdev: 0.000409,
            median: 0.000875,
            madev: 0.000117,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002116,
            mean: 0.002077,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 4.846938,
            mean: 0.093892,
            stdev: 0.542976,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_4096_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 4096.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.563651,
          'Round Trip Throughput': {
            count: 144,
            min: 4163.077844,
            max: 4183.078853,
            mean: 4179.356604,
            stdev: 4.291042,
            median: 4181.064437,
            madev: 1.220974,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000013,
            max: 0.002784,
            mean: 0.00046,
            stdev: 0.000583,
            median: 0.000231,
            madev: 0.000154,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.000964,
            max: 0.004825,
            mean: 0.002055,
            stdev: 0.00077,
            median: 0.001945,
            madev: 0.000423,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 4171.381899,
            max: 4184.098984,
            mean: 4182.33958,
            stdev: 1.858449,
            median: 4183.060836,
            madev: 0.501947,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.118191,
            max: 0.563651,
            mean: 0.411572,
            stdev: 0.064972,
            median: 0.446301,
            madev: 0.106573,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 1.585303,
            mean: 1.436538,
            stdev: 0.181359,
            median: 1.47518,
            madev: 0.001913,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 5.050000000000367e-7,
            max: 0.004879,
            mean: 0.000582,
            stdev: 0.000821,
            median: 0.00022,
            madev: 0.000208,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.000733,
            max: 0.007769,
            mean: 0.001878,
            stdev: 0.001004,
            median: 0.001339,
            madev: 0.00045,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002116,
            mean: 0.002077,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 6.297229,
            mean: 0.141756,
            stdev: 0.717422,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_4096_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 4096.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.561108,
          'Round Trip Throughput': {
            count: 36,
            min: 4171.393647,
            max: 4183.203455,
            mean: 4180.935384,
            stdev: 2.838152,
            median: 4182.17634,
            madev: 0.65115,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000004,
            max: 0.000962,
            mean: 0.000158,
            stdev: 0.000208,
            median: 0.000094,
            madev: 0.000078,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.00091,
            max: 0.002194,
            mean: 0.001288,
            stdev: 0.000299,
            median: 0.001255,
            madev: 0.000138,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 4179.671828,
            max: 4183.903384,
            mean: 4183.116646,
            stdev: 0.892336,
            median: 4183.416856,
            madev: 0.283206,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.305996,
            max: 0.561108,
            mean: 0.344738,
            stdev: 0.047608,
            median: 0.335255,
            madev: 0.006921,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.44563,
            mean: 1.393153,
            stdev: 0.175609,
            median: 1.434363,
            madev: 0.002551,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 5.790000000000092e-7,
            max: 0.001386,
            mean: 0.000167,
            stdev: 0.000219,
            median: 0.000079,
            madev: 0.000068,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.000724,
            max: 0.002324,
            mean: 0.001104,
            stdev: 0.000287,
            median: 0.001061,
            madev: 0.000144,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002116,
            mean: 0.002077,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 3.768844,
            mean: 0.082302,
            stdev: 0.446209,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_65536_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 65536.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.561011,
          'Round Trip Throughput': {
            count: 144,
            min: 64576.894184,
            max: 65593.148153,
            mean: 65402.578059,
            stdev: 221.969259,
            median: 65481.742994,
            madev: 69.459207,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000001,
            max: 0.003299,
            mean: 0.000629,
            stdev: 0.000639,
            median: 0.000351,
            madev: 0.000243,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.00218,
            max: 0.009694,
            mean: 0.005602,
            stdev: 0.00217,
            median: 0.006159,
            madev: 0.001521,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 64989.975025,
            max: 65617.45027,
            mean: 65528.507414,
            stdev: 98.565246,
            median: 65565.157234,
            madev: 35.226283,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.287972,
            max: 0.561011,
            mean: 0.411719,
            stdev: 0.037056,
            median: 0.414376,
            madev: 0.083359,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 1.518124,
            mean: 1.439221,
            stdev: 0.181755,
            median: 1.500266,
            madev: 0.016582,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 4.590000000003966e-7,
            max: 0.006096,
            mean: 0.000878,
            stdev: 0.00099,
            median: 0.000419,
            madev: 0.000349,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.00161,
            max: 0.012267,
            mean: 0.005391,
            stdev: 0.001845,
            median: 0.005405,
            madev: 0.001896,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002117,
            mean: 0.002077,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 6.532663,
            mean: 0.156474,
            stdev: 0.715701,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-rtps_65536_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'rtps',
            Bytes: 65536.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.555264,
          'Round Trip Throughput': {
            count: 36,
            min: 64971.213556,
            max: 65596.347736,
            mean: 65459.10778,
            stdev: 158.010588,
            median: 65520.1197,
            madev: 46.183909,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000003,
            max: 0.001015,
            mean: 0.000189,
            stdev: 0.000216,
            median: 0.000134,
            madev: 0.000083,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.001687,
            max: 0.005826,
            mean: 0.004092,
            stdev: 0.001288,
            median: 0.004629,
            madev: 0.000274,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 65296.86902,
            max: 65618.693916,
            mean: 65554.169088,
            stdev: 67.433501,
            median: 65582.966653,
            madev: 20.191228,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.298926,
            max: 0.555264,
            mean: 0.340466,
            stdev: 0.045293,
            median: 0.327146,
            madev: 0.013474,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.488361,
            mean: 1.454736,
            stdev: 0.183478,
            median: 1.480283,
            madev: 0.008078,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.000006,
            max: 0.001088,
            mean: 0.000244,
            stdev: 0.000225,
            median: 0.000162,
            madev: 0.000105,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.001467,
            max: 0.005965,
            mean: 0.003907,
            stdev: 0.000908,
            median: 0.004398,
            madev: 0.000332,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002117,
            mean: 0.002078,
            stdev: 0.000263,
            median: 0.002116,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 4.534005,
            mean: 0.088589,
            stdev: 0.474691,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_1048576_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 1048576.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.330146,
          'Round Trip Throughput': {
            count: 144,
            min: 988862.297436,
            max: 1043187.690592,
            mean: 1030621.933974,
            stdev: 13766.743074,
            median: 1036366.999905,
            madev: 4781.48592,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000011,
            max: 0.027239,
            mean: 0.003171,
            stdev: 0.005162,
            median: 0.001103,
            madev: 0.000694,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.016326,
            max: 0.052863,
            mean: 0.030454,
            stdev: 0.005494,
            median: 0.029919,
            madev: 0.002818,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 1018026.126048,
            max: 1046729.005014,
            mean: 1040831.139204,
            stdev: 6520.857885,
            median: 1043448.931308,
            madev: 2083.346154,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.125375,
            max: 1.330146,
            mean: 0.433661,
            stdev: 0.195315,
            median: 0.356938,
            madev: 0.02367,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 5.3601,
            mean: 2.061857,
            stdev: 0.338759,
            median: 1.985828,
            madev: 0.008503,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.000007,
            max: 0.044728,
            mean: 0.003841,
            stdev: 0.006263,
            median: 0.001726,
            madev: 0.001129,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.013961,
            max: 0.07187,
            mean: 0.030085,
            stdev: 0.006705,
            median: 0.027167,
            madev: 0.005531,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002323,
            mean: 0.002109,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 8.333333,
            mean: 0.178875,
            stdev: 0.748174,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_1048576_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 1048576.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.352252,
          'Round Trip Throughput': {
            count: 36,
            min: 1017700.815992,
            max: 1046213.414215,
            mean: 1040306.170173,
            stdev: 8230.622763,
            median: 1043888.222209,
            madev: 2010.868749,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000021,
            max: 0.006191,
            mean: 0.001379,
            stdev: 0.001408,
            median: 0.000938,
            madev: 0.000482,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.009276,
            max: 0.021455,
            mean: 0.012767,
            stdev: 0.002553,
            median: 0.012015,
            madev: 0.000874,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 1033142.636359,
            max: 1048440.607711,
            mean: 1045362.190384,
            stdev: 3924.37045,
            median: 1046948.838321,
            madev: 831.995641,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.321974,
            max: 0.352252,
            mean: 0.337343,
            stdev: 0.003428,
            median: 0.337184,
            madev: 0.00626,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 2.148461,
            mean: 1.924902,
            stdev: 0.262462,
            median: 1.950963,
            madev: 0.056974,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.000024,
            max: 0.010355,
            mean: 0.00149,
            stdev: 0.001792,
            median: 0.00092,
            madev: 0.000707,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.007779,
            max: 0.025951,
            mean: 0.012406,
            stdev: 0.00263,
            median: 0.012406,
            madev: 0.001942,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002179,
            mean: 0.002106,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 4.030226,
            mean: 0.113673,
            stdev: 0.469272,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_256_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 256.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.414821,
          'Round Trip Throughput': {
            count: 144,
            min: 342.687865,
            max: 343.94583,
            mean: 343.716084,
            stdev: 0.273673,
            median: 343.824296,
            madev: 0.070169,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.0,
            max: 0.002317,
            mean: 0.000222,
            stdev: 0.000363,
            median: 0.000062,
            madev: 0.000058,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.000882,
            max: 0.003512,
            mean: 0.00159,
            stdev: 0.000493,
            median: 0.00154,
            madev: 0.000296,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 343.409533,
            max: 344.03806,
            mean: 343.923534,
            stdev: 0.096865,
            median: 343.955804,
            madev: 0.024961,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.124136,
            max: 0.414821,
            mean: 0.349772,
            stdev: 0.043291,
            median: 0.36274,
            madev: 0.02137,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 4.796729,
            mean: 1.586209,
            stdev: 0.314932,
            median: 1.494101,
            madev: 0.005314,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.0,
            max: 0.003864,
            mean: 0.000238,
            stdev: 0.000432,
            median: 0.000068,
            madev: 0.00006,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.000509,
            max: 0.004907,
            mean: 0.00141,
            stdev: 0.000578,
            median: 0.001128,
            madev: 0.000299,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002317,
            mean: 0.002109,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 7.575757,
            mean: 0.133935,
            stdev: 0.743537,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_256_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 256.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.343727,
          'Round Trip Throughput': {
            count: 36,
            min: 343.260357,
            max: 343.936613,
            mean: 343.790958,
            stdev: 0.181204,
            median: 343.875355,
            madev: 0.04054,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000011,
            max: 0.000658,
            mean: 0.000172,
            stdev: 0.000163,
            median: 0.000109,
            madev: 0.000083,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.000834,
            max: 0.001737,
            mean: 0.001103,
            stdev: 0.000193,
            median: 0.00107,
            madev: 0.000085,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 343.668687,
            max: 344.013877,
            mean: 343.938336,
            stdev: 0.062482,
            median: 343.965097,
            madev: 0.014214,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.125264,
            max: 0.343727,
            mean: 0.233246,
            stdev: 0.070255,
            median: 0.23163,
            madev: 0.099922,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.533218,
            mean: 1.455039,
            stdev: 0.183356,
            median: 1.465826,
            madev: 0.007228,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.0,
            max: 0.000978,
            mean: 0.000186,
            stdev: 0.000181,
            median: 0.000133,
            madev: 0.000113,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.000599,
            max: 0.001896,
            mean: 0.000911,
            stdev: 0.000209,
            median: 0.00086,
            madev: 0.000117,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002173,
            mean: 0.002105,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 3.778337,
            mean: 0.07529,
            stdev: 0.45187,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_4096_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 4096.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.47438,
          'Round Trip Throughput': {
            count: 144,
            min: 4167.250216,
            max: 4183.174924,
            mean: 4180.217302,
            stdev: 3.454875,
            median: 4181.623137,
            madev: 0.951695,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000003,
            max: 0.001694,
            mean: 0.000298,
            stdev: 0.000385,
            median: 0.000125,
            madev: 0.000108,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.000835,
            max: 0.003675,
            mean: 0.001708,
            stdev: 0.000523,
            median: 0.001667,
            madev: 0.000331,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 4176.867918,
            max: 4184.553283,
            mean: 4182.924676,
            stdev: 1.154545,
            median: 4183.289984,
            madev: 0.36258,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.130856,
            max: 0.47438,
            mean: 0.355663,
            stdev: 0.053803,
            median: 0.347259,
            madev: 0.024102,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 4.629206,
            mean: 1.57777,
            stdev: 0.325404,
            median: 1.494314,
            madev: 0.001913,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.0,
            max: 0.002837,
            mean: 0.000319,
            stdev: 0.000426,
            median: 0.000124,
            madev: 0.000109,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.000593,
            max: 0.004829,
            mean: 0.001516,
            stdev: 0.000602,
            median: 0.00125,
            madev: 0.000363,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002317,
            mean: 0.002109,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 8.080808,
            mean: 0.133425,
            stdev: 0.728284,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_4096_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 4096.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.349071,
          'Round Trip Throughput': {
            count: 36,
            min: 4175.420287,
            max: 4183.339645,
            mean: 4181.554931,
            stdev: 2.054729,
            median: 4182.344456,
            madev: 0.696622,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000003,
            max: 0.001113,
            mean: 0.000167,
            stdev: 0.000221,
            median: 0.000094,
            madev: 0.00004,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.000751,
            max: 0.001898,
            mean: 0.001087,
            stdev: 0.000233,
            median: 0.001049,
            madev: 0.000087,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 4180.254512,
            max: 4185.858466,
            mean: 4183.392915,
            stdev: 0.712292,
            median: 4183.591322,
            madev: 0.276064,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.127042,
            max: 0.349071,
            mean: 0.283448,
            stdev: 0.061987,
            median: 0.326977,
            madev: 0.0117,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.639089,
            mean: 1.435874,
            stdev: 0.182364,
            median: 1.45796,
            madev: 0.100556,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.000004,
            max: 0.001493,
            mean: 0.000183,
            stdev: 0.000231,
            median: 0.000096,
            madev: 0.000074,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.000483,
            max: 0.001977,
            mean: 0.000896,
            stdev: 0.00024,
            median: 0.000863,
            madev: 0.000126,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002173,
            mean: 0.002105,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 4.030226,
            mean: 0.077679,
            stdev: 0.464469,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_65536_16': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 65536.0,
            Servers: 16.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.417474,
          'Round Trip Throughput': {
            count: 144,
            min: 65128.207741,
            max: 65596.250002,
            mean: 65497.227235,
            stdev: 104.949981,
            median: 65542.608717,
            madev: 32.397272,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 144,
            min: 0.000012,
            max: 0.004708,
            mean: 0.000743,
            stdev: 0.000781,
            median: 0.000516,
            madev: 0.000363,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 160,
            min: 0.001496,
            max: 0.006929,
            mean: 0.0034,
            stdev: 0.00091,
            median: 0.003363,
            madev: 0.000577,
            overflow: 0
          },
          Throughput: {
            count: 288,
            min: 65388.817348,
            max: 65688.913127,
            mean: 65578.024356,
            stdev: 44.392831,
            median: 65594.144715,
            madev: 14.024336,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 64,
            min: 0.305217,
            max: 0.417474,
            mean: 0.368993,
            stdev: 0.016073,
            median: 0.371097,
            madev: 0.021164,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 4.809272,
            mean: 1.633661,
            stdev: 0.320026,
            median: 1.536194,
            madev: 0.005527,
            overflow: 0
          },
          Jitter: {
            count: 288,
            min: 0.000001,
            max: 0.008813,
            mean: 0.000824,
            stdev: 0.000965,
            median: 0.000357,
            madev: 0.000278,
            overflow: 0
          },
          Latency: {
            count: 320,
            min: 0.001041,
            max: 0.01037,
            mean: 0.003217,
            stdev: 0.001131,
            median: 0.002805,
            madev: 0.000835,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1088,
            min: 0.0,
            max: 0.002317,
            mean: 0.002109,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1088,
            min: 0.0,
            max: 7.556675,
            mean: 0.137836,
            stdev: 0.733793,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'fan-tcp_65536_4': {
          scenario_parameters: {
            Base: 'fan',
            Config: 'tcp',
            Bytes: 65536.0,
            Servers: 4.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 0.34671,
          'Round Trip Throughput': {
            count: 36,
            min: 65339.195268,
            max: 65599.239996,
            mean: 65542.029363,
            stdev: 70.664263,
            median: 65571.639513,
            madev: 20.629702,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 36,
            min: 0.000015,
            max: 0.000841,
            mean: 0.000262,
            stdev: 0.000207,
            median: 0.000173,
            madev: 0.000089,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 40,
            min: 0.001682,
            max: 0.002986,
            mean: 0.002142,
            stdev: 0.000269,
            median: 0.002113,
            madev: 0.000158,
            overflow: 0
          },
          Throughput: {
            count: 72,
            min: 65484.70212,
            max: 65619.773991,
            mean: 65592.688853,
            stdev: 28.977897,
            median: 65604.912194,
            madev: 8.447762,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 16,
            min: 0.123465,
            max: 0.34671,
            mean: 0.28291,
            stdev: 0.06222,
            median: 0.329587,
            madev: 0.009606,
            overflow: 0
          },
          'Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 1.66375,
            mean: 1.48376,
            stdev: 0.18801,
            median: 1.500479,
            madev: 0.00659,
            overflow: 0
          },
          Jitter: {
            count: 72,
            min: 0.000004,
            max: 0.001218,
            mean: 0.000294,
            stdev: 0.000254,
            median: 0.000216,
            madev: 0.000165,
            overflow: 0
          },
          Latency: {
            count: 80,
            min: 0.001155,
            max: 0.003134,
            mean: 0.001967,
            stdev: 0.000303,
            median: 0.001947,
            madev: 0.000236,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 320,
            min: 0.0,
            max: 0.002174,
            mean: 0.002105,
            stdev: 0.000267,
            median: 0.002138,
            madev: 0.0,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 320,
            min: 0.0,
            max: 4.0201,
            mean: 0.079936,
            stdev: 0.453277,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          }
        },
        'showtime-mixed_10': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 10.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.03178,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 29939,
            min: 65.707807,
            max: 333.123895,
            mean: 238.019619,
            stdev: 80.775422,
            median: 332.456567,
            madev: 0.082656,
            overflow: 0
          },
          'Discovery Time Delta': {
            count: 1526,
            min: 0.002194,
            max: 1.03178,
            mean: 0.667516,
            stdev: 0.234945,
            median: 0.721063,
            madev: 0.079097,
            overflow: 0
          },
          'Memory Utilization': {
            count: 1122,
            min: 0.0,
            max: 3.505016,
            mean: 3.107665,
            stdev: 0.364936,
            median: 3.316021,
            madev: 0.080147,
            overflow: 0
          },
          Jitter: {
            count: 29939,
            min: 0.0,
            max: 0.003143,
            mean: 0.000095,
            stdev: 0.00015,
            median: 0.000058,
            madev: 0.000039,
            overflow: 0
          },
          Latency: {
            count: 30702,
            min: 0.000251,
            max: 0.004292,
            mean: 0.000872,
            stdev: 0.000217,
            median: 0.000874,
            madev: 0.000106,
            overflow: 0
          },
          'Virtual Memory Utilization': {
            count: 1122,
            min: 0.0,
            max: 0.005749,
            mean: 0.005145,
            stdev: 0.000732,
            median: 0.005558,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 1122,
            min: 0.0,
            max: 15.561224,
            mean: 0.826608,
            stdev: 1.353689,
            median: 0.751879,
            madev: 0.250626,
            overflow: 0
          }
        },
        'showtime-mixed_20': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 20.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.136754,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 117219,
            min: 65.636178,
            max: 332.646651,
            mean: 239.753228,
            stdev: 81.642438,
            median: 332.485624,
            madev: 0.033842,
            overflow: 11200
          },
          'Discovery Time Delta': {
            count: 5846,
            min: 0.002285,
            max: 1.136754,
            mean: 0.694565,
            stdev: 0.166899,
            median: 0.730902,
            madev: 0.085866,
            overflow: 0
          },
          'Memory Utilization': {
            count: 2142,
            min: 0.0,
            max: 3.99738,
            mean: 3.395743,
            stdev: 0.410418,
            median: 3.510118,
            madev: 0.070368,
            overflow: 0
          },
          Jitter: {
            count: 117219,
            min: 0.0,
            max: 0.008435,
            mean: 0.000094,
            stdev: 0.000182,
            median: 0.000056,
            madev: 0.000037,
            overflow: 11200
          },
          Latency: {
            count: 120142,
            min: 0.000231,
            max: 0.009476,
            mean: 0.000943,
            stdev: 0.000217,
            median: 0.000948,
            madev: 0.0001,
            overflow: 12800
          },
          'Virtual Memory Utilization': {
            count: 2142,
            min: 0.0,
            max: 0.00575,
            mean: 0.005308,
            stdev: 0.000757,
            median: 0.005559,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 2142,
            min: 0.0,
            max: 29.015544,
            mean: 1.671625,
            stdev: 2.485015,
            median: 1.511335,
            madev: 0.256341,
            overflow: 0
          }
        },
        'showtime-mixed_30': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 30.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.536222,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 261899,
            min: 65.70578,
            max: 332.765801,
            mean: 240.330364,
            stdev: 81.929932,
            median: 139.640291,
            madev: 73.911697,
            overflow: 85200
          },
          'Discovery Time Delta': {
            count: 12966,
            min: 0.002288,
            max: 1.536222,
            mean: 0.677617,
            stdev: 0.2002,
            median: 0.739033,
            madev: 0.112222,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3067,
            min: 0.0,
            max: 5.841197,
            mean: 3.730789,
            stdev: 0.467378,
            median: 3.706554,
            madev: 0.080785,
            overflow: 0
          },
          Jitter: {
            count: 261899,
            min: 0.0,
            max: 0.009936,
            mean: 0.000106,
            stdev: 0.000188,
            median: 0.000065,
            madev: 0.000042,
            overflow: 85200
          },
          Latency: {
            count: 268382,
            min: 0.000335,
            max: 0.010991,
            mean: 0.001006,
            stdev: 0.000212,
            median: 0.001001,
            madev: 0.0001,
            overflow: 88800
          },
          'Virtual Memory Utilization': {
            count: 3067,
            min: 0.0,
            max: 0.008785,
            mean: 0.005487,
            stdev: 0.000788,
            median: 0.005559,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3067,
            min: 0.0,
            max: 56.196563,
            mean: 2.65065,
            stdev: 3.65096,
            median: 2.278481,
            madev: 0.501831,
            overflow: 0
          }
        },
        'showtime-mixed_40': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 40.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.622373,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 463979,
            min: 65.681162,
            max: 333.343516,
            mean: 240.623163,
            stdev: 82.074858,
            median: 139.64055,
            madev: 73.907409,
            overflow: 204800
          },
          'Discovery Time Delta': {
            count: 22886,
            min: 0.002766,
            max: 1.622373,
            mean: 0.864631,
            stdev: 0.197116,
            median: 0.864473,
            madev: 0.113831,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 10.057974,
            mean: 5.248685,
            stdev: 0.714047,
            median: 4.005246,
            madev: 0.192183,
            overflow: 0
          },
          Jitter: {
            count: 463979,
            min: 0.0,
            max: 0.023159,
            mean: 0.000131,
            stdev: 0.000327,
            median: 0.000076,
            madev: 0.000051,
            overflow: 204800
          },
          Latency: {
            count: 475422,
            min: 0.000262,
            max: 0.024032,
            mean: 0.001052,
            stdev: 0.000347,
            median: 0.001029,
            madev: 0.000112,
            overflow: 211200
          },
          'Virtual Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 0.013964,
            mean: 0.007245,
            stdev: 0.001094,
            median: 0.005559,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3060,
            min: 0.0,
            max: 74.870466,
            mean: 4.08047,
            stdev: 5.686482,
            median: 3.274559,
            madev: 0.996078,
            overflow: 0
          }
        },
        'showtime-mixed_50': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 50.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.902857,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 723459,
            min: 65.672153,
            max: 333.271986,
            mean: 240.795361,
            stdev: 82.160309,
            median: 139.63991,
            madev: 0.016411,
            overflow: 374641
          },
          'Discovery Time Delta': {
            count: 35606,
            min: 0.00233,
            max: 1.902857,
            mean: 0.935777,
            stdev: 0.210789,
            median: 0.951196,
            madev: 0.134032,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3061,
            min: 0.0,
            max: 11.542083,
            mean: 6.863214,
            stdev: 0.936252,
            median: 8.073208,
            madev: 0.224072,
            overflow: 0
          },
          Jitter: {
            count: 723459,
            min: 0.0,
            max: 0.018292,
            mean: 0.000135,
            stdev: 0.000325,
            median: 0.000078,
            madev: 0.000051,
            overflow: 374641
          },
          Latency: {
            count: 741262,
            min: 0.000333,
            max: 0.019316,
            mean: 0.001109,
            stdev: 0.000342,
            median: 0.001076,
            madev: 0.000112,
            overflow: 387242
          },
          'Virtual Memory Utilization': {
            count: 3061,
            min: 0.0,
            max: 0.014155,
            mean: 0.009006,
            stdev: 0.001328,
            median: 0.010928,
            madev: 0.000381,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3061,
            min: 0.0,
            max: 89.034775,
            mean: 6.287011,
            stdev: 7.492119,
            median: 5.374778,
            madev: 1.548248,
            overflow: 0
          }
        },
        'showtime-mixed_60': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 60.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 1.780752,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 1040339,
            min: 65.664863,
            max: 334.424662,
            mean: 240.912946,
            stdev: 82.217482,
            median: 139.640867,
            madev: 73.90127,
            overflow: 611361
          },
          'Discovery Time Delta': {
            count: 51126,
            min: 0.002901,
            max: 1.780752,
            mean: 0.938454,
            stdev: 0.193708,
            median: 0.938813,
            madev: 0.130589,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 11.870752,
            mean: 8.579718,
            stdev: 1.119723,
            median: 8.609367,
            madev: 0.159019,
            overflow: 0
          },
          Jitter: {
            count: 1040339,
            min: 0.0,
            max: 0.027023,
            mean: 0.000153,
            stdev: 0.000433,
            median: 0.000084,
            madev: 0.000055,
            overflow: 611361
          },
          Latency: {
            count: 1065902,
            min: 0.000227,
            max: 0.028075,
            mean: 0.001162,
            stdev: 0.000451,
            median: 0.001112,
            madev: 0.000118,
            overflow: 629482
          },
          'Virtual Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 0.014727,
            mean: 0.010809,
            stdev: 0.001529,
            median: 0.010928,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3060,
            min: 0.0,
            max: 90.697674,
            mean: 8.279887,
            stdev: 8.45688,
            median: 7.397959,
            madev: 1.320999,
            overflow: 0
          }
        },
        'showtime-mixed_70': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 70.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 2.472031,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 1414619,
            min: 65.686392,
            max: 335.983485,
            mean: 240.998736,
            stdev: 82.261106,
            median: 139.640524,
            madev: 73.902851,
            overflow: 901881
          },
          'Discovery Time Delta': {
            count: 69446,
            min: 0.002871,
            max: 2.472031,
            mean: 1.146757,
            stdev: 0.234969,
            median: 1.137748,
            madev: 0.17009,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 16.273972,
            mean: 10.346023,
            stdev: 1.372425,
            median: 9.078771,
            madev: 0.247032,
            overflow: 0
          },
          Jitter: {
            count: 1414619,
            min: 0.0,
            max: 0.047945,
            mean: 0.000195,
            stdev: 0.000522,
            median: 0.0001,
            madev: 0.000068,
            overflow: 901881
          },
          Latency: {
            count: 1449342,
            min: 0.000298,
            max: 0.049262,
            mean: 0.001257,
            stdev: 0.000535,
            median: 0.001174,
            madev: 0.000136,
            overflow: 926522
          },
          'Virtual Memory Utilization': {
            count: 3060,
            min: 0.0,
            max: 0.019715,
            mean: 0.012503,
            stdev: 0.001797,
            median: 0.011119,
            madev: 0.000381,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3060,
            min: 0.0,
            max: 95.559708,
            mean: 11.265609,
            stdev: 9.713752,
            median: 9.775594,
            madev: 2.203572,
            overflow: 0
          }
        },
        'showtime-mixed_80': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 80.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 2.693916,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 1846623,
            min: 65.626102,
            max: 334.628333,
            mean: 241.046027,
            stdev: 82.28534,
            median: 139.642542,
            madev: 73.908865,
            overflow: 1246525
          },
          'Discovery Time Delta': {
            count: 90566,
            min: 0.001944,
            max: 2.693916,
            mean: 1.280654,
            stdev: 0.247914,
            median: 1.29003,
            madev: 0.202653,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3069,
            min: 0.0,
            max: 17.03803,
            mean: 12.308368,
            stdev: 1.730479,
            median: 13.791527,
            madev: 0.421996,
            overflow: 0
          },
          Jitter: {
            count: 1846623,
            min: 0.0,
            max: 0.053778,
            mean: 0.000271,
            stdev: 0.000679,
            median: 0.000129,
            madev: 0.000089,
            overflow: 1246525
          },
          Latency: {
            count: 1891906,
            min: 0.0003,
            max: 0.054833,
            mean: 0.001371,
            stdev: 0.000691,
            median: 0.001232,
            madev: 0.000163,
            overflow: 1278686
          },
          'Virtual Memory Utilization': {
            count: 3069,
            min: 0.0,
            max: 0.019334,
            mean: 0.014274,
            stdev: 0.002141,
            median: 0.016298,
            madev: 0.000381,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3069,
            min: 0.0,
            max: 97.290371,
            mean: 14.042052,
            stdev: 10.754797,
            median: 12.640187,
            madev: 2.795627,
            overflow: 0
          }
        },
        'showtime-mixed_90': {
          scenario_parameters: {
            Base: 'showtime_mixed',
            Nodes: 90.0
          },
          Errors: 0,
          'Max Discovery Time Delta': 2.637323,
          'Round Trip Throughput': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Jitter': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          'Round Trip Latency': {
            count: 0,
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            stdev: 0.0,
            median: 0.0,
            madev: 0.0,
            overflow: 0
          },
          Throughput: {
            count: 2337367,
            min: 65.682942,
            max: 335.28436,
            mean: 241.026891,
            stdev: 82.279041,
            median: 139.64247,
            madev: 73.905348,
            overflow: 1646309
          },
          'Discovery Time Delta': {
            count: 114486,
            min: 0.001954,
            max: 2.637323,
            mean: 1.431985,
            stdev: 0.248142,
            median: 1.444908,
            madev: 0.196353,
            overflow: 0
          },
          'Memory Utilization': {
            count: 3104,
            min: 0.0,
            max: 17.863528,
            mean: 14.269912,
            stdev: 2.329478,
            median: 14.660393,
            madev: 0.130106,
            overflow: 0
          },
          Jitter: {
            count: 2337367,
            min: 0.0,
            max: 0.132719,
            mean: 0.000371,
            stdev: 0.00163,
            median: 0.000155,
            madev: 0.000107,
            overflow: 1646309
          },
          Latency: {
            count: 2394610,
            min: 0.000288,
            max: 0.133894,
            mean: 0.001515,
            stdev: 0.001632,
            median: 0.001281,
            madev: 0.000186,
            overflow: 1686990
          },
          'Virtual Memory Utilization': {
            count: 3104,
            min: 0.0,
            max: 0.019716,
            mean: 0.015986,
            stdev: 0.002746,
            median: 0.016489,
            madev: 0.00019,
            overflow: 0
          },
          'Cpu Utilization': {
            count: 3104,
            min: 0.0,
            max: 103.439153,
            mean: 17.301757,
            stdev: 12.091673,
            median: 15.850466,
            madev: 3.065026,
            overflow: 0
          }
        }
      }
  })
);
