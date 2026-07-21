import type {BenchmarkIdentifier} from '../types';

export const resultPath = (id: BenchmarkIdentifier): string =>
  `/raw/${encodeURIComponent(id)}/results.json`;
