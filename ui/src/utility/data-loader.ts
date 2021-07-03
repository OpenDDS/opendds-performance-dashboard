import {writable, get} from 'svelte/store';
import type {
  Benchmark,
  BenchmarkIdentifier,
  Benchmarks,
  GitHubTag,
  RunIndex,
  StatProperties
} from '../types';
import {Cache, CACHE_TEN_MIN} from './caching';

const PRODUCTION = 'http://scoreboard.ociweb.com';
const LOCALHOST = 'http://localhost:1919';
const BASE_URL = location.hostname === 'localhost' ? LOCALHOST : PRODUCTION;

const collectedDataStore = writable<Benchmarks>({});
const collectedDataErrors = writable<Error[]>([]);

type BenchmarkEntry = {
  id: BenchmarkIdentifier;
  data: Benchmark;
};

type BenchmarkLoadResponse = {
  results: Benchmarks;
  errors: Error[];
};

type BenchmarkEntriesResponse = {
  results: BenchmarkEntry[];
  errors: Error[];
};

export const errorStore = {
  ...collectedDataErrors,
  clear() {
    collectedDataErrors.set([]);
  },

  onError(error: Error) {
    errorStore.addErrors([error]);
  },

  addErrors(errors: Error[]) {
    errorStore.update(store => {
      const keys = store.map(e => e.message);
      const newErrors = errors.filter(e => !keys.includes(e.message));
      return [...store, ...newErrors];
    });
  }
};

/**
 * Fetchable Data Store that collects that aggregates the incrementally loaded benchmarks
 */
export const dataStore = {
  ...collectedDataStore,
  /**
   * Load All Benchmarks at once
   * @returns {Promise<Benchmarks>}
   * @deprecated use incremental loading
   */
  loadAll: async (): Promise<Benchmarks> => {
    const results = await getAllScraped();
    collectedDataStore.set(results);
    return results;
  },

  /**
   * Incrementally load benchmarks for given ids
   * @param {Array<String>} ids the list of benchmark-timestamps to load
   * @returns
   */
  loadBenchmarks: async (
    ids: BenchmarkIdentifier[] = []
  ): Promise<BenchmarkLoadResponse> => {
    const {results, errors} = await getEntries(ids);
    const data = results.reduce((acc, entry) => {
      acc[entry.id] = entry.data;
      return acc;
    }, {});
    collectedDataStore.update(existing => ({
      ...existing,
      ...data
    }));

    errorStore.addErrors(errors);

    return {
      results: get(collectedDataStore),
      errors: errors
    };
  }
};

/**
 * Get The Full Scrape Data all at once
 * @deprecated Use the incremental loader
 */
export async function getAllScraped(): Promise<Benchmarks> {
  return fetcher.get('/bench2/scrape_output.json');
}

/**
 * Get the Stat Properties
 */
export async function getStatProperties(): Promise<StatProperties> {
  return fetcher.get('/bench2/stat_properties.json');
}

/**
 * Get List of runs with relevant
 */
export async function getRunIndex(): Promise<RunIndex> {
  return fetcher.get('/bench2/run_index.json');
}

/**
 * Load a list of benchmark / timestamp entries
 */
export async function getEntries(
  ids: BenchmarkIdentifier[] = []
): Promise<BenchmarkEntriesResponse> {
  const data = await Promise.all(
    ids.map<Promise<BenchmarkEntry | Error>>(i => getEntry(i).catch(e => e))
  );

  const collector: BenchmarkEntriesResponse = {
    results: [],
    errors: []
  };

  return data.reduce((acc, response) => {
    if (response instanceof Error) acc.errors.push(response);
    else acc.results.push(response);
    return acc;
  }, collector);
}

export async function getEntry(
  id: BenchmarkIdentifier
): Promise<BenchmarkEntry> {
  return Cache.cache(id, async () => {
    const data: Benchmark = await fetcher.get(`/bench2/raw/${id}/results.json`);
    return {id: id, data};
  });
}

/**
 * Load GitHub Tags for the OpenDDS Repo
 * @returns Promise<Array>
 */
export async function getGitTags() {
  const url =
    'https://api.github.com/repos/objectcomputing/OpenDDS/tags?per_page=100';
  const aggregatedFetch = async (url: string, data: GitHubTag[] = []) => {
    const response = await fetch(url);

    if (!response.ok) {
      const {message} = await response
        .json()
        .catch(() => ({message: 'Something went wrong'}));
      throw new Error(message);
    }
    const next = <GitHubTag[]>await response.json();
    const aggregate = [...data, ...next];

    const links = extractLinks(response.headers.get('Link'));
    if (links.next) {
      return aggregatedFetch(links.next, aggregate);
    }
    return aggregate;
  };
  return Cache.expiring(CACHE_TEN_MIN, 'open-dds-github-tags', () =>
    aggregatedFetch(url, [])
  );
}

//----------------------------------------------------------------
// Underlying Fetcher utility
//------------------------------------------------------------
const responseHandler = async (response: Response) => {
  try {
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || 'Something Went Wrong');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const withBaseUrl = (url: string) =>
  `${BASE_URL}${('/' + url).replace('//', '/')}`;

const fetcher = {
  get: (url: string) => fetch(withBaseUrl(url)).then(responseHandler)
};

//----------------------------------------------------------------
// Git Hub Aggregation Helpers
//------------------------------------------------------------

const LINKS_MATCHER = /<?([^>]*)>(.*)/;
const LINKS_REL_MATCHER = /\s*(.+)\s*=\s*"?([^"]+)"?/;

function getRelKey(acc: Record<string, string>, p: string) {
  const m = p.match(LINKS_REL_MATCHER);
  if (m) acc[m[1]] = m[2];
  return acc;
}

function parseLink(string: string): Record<string, string> | null {
  try {
    const matches = string.match(LINKS_MATCHER);
    const url = matches[1];
    const parts = matches[2].split(';');
    const link = parts.reduce(getRelKey, {});
    link.url = url;
    return link;
  } catch (e) {
    return null;
  }
}

export function extractLinks(links = ''): Record<string, string> {
  if (typeof links !== 'string') {
    return {};
  }
  return links.split(',').reduce((acc, link) => {
    try {
      const val = parseLink(link.trim());
      if (val) {
        acc[val.rel] = val.url;
      }
    } catch (e) {
      // pass
    }
    return acc;
  }, {});
}
