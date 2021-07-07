import { writable, get } from "svelte/store";
import type { AppError, BenchmarkIdentifier, Benchmarks } from "../types";
import {
  BenchmarkLoadResponse,
  getAllScraped,
  getEntries,
} from "./data-loader";

const collectedDataStore = writable<Benchmarks>({});
const collectedDataErrors = writable<AppError[]>([]);

export const errorStore = {
  ...collectedDataErrors,
  clear(): void {
    collectedDataErrors.set([]);
  },

  remove(key: string): void {
    errorStore.update((store) => {
      return store.filter((e) => e.key !== key);
    });
  },

  onError(error: AppError): void {
    errorStore.addErrors([error]);
  },

  addErrors(errors: AppError[]): void {
    errorStore.update((store) => {
      const keys = store.map((e) => e.message);
      const newErrors = errors.filter((e) => !keys.includes(e.message));
      return [...store, ...newErrors];
    });
  },
};

/**
 * Fetchable Data Store that collects that aggregates the incrementally loaded benchmarks
 */
export const dataStore = {
  ...collectedDataStore,
  /**
   * Load All Benchmarks at once
   * @returns {Promise<Benchmarks>}
   * @deprecated use loadBenchmarks(ids) for incremental loading
   */
  loadAll: async (): Promise<Benchmarks> => {
    const results = await getAllScraped();
    collectedDataStore.set(results);
    return results;
  },

  /**
   * Incrementally load benchmarks for given ids
   * @param ids the list of benchmark-timestamps to load
   * @returns
   */
  loadBenchmarks: async (
    ids: BenchmarkIdentifier[] = []
  ): Promise<BenchmarkLoadResponse> => {
    const { results, errors } = await getEntries(ids);
    const data = results.reduce((acc, entry) => {
      acc[entry.id] = entry.data;
      return acc;
    }, {});
    collectedDataStore.update((existing) => ({
      ...existing,
      ...data,
    }));

    if (errors.length) {
      errorStore.addErrors(errors);
    }

    return {
      results: get(collectedDataStore),
      errors: errors,
    };
  },
};
