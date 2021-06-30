import {writable, get} from 'svelte/store';
import {Cache, CACHE_TEN_MIN} from './caching';

const PRODUCTION = 'http://scoreboard.ociweb.com';
const LOCALHOST = 'http://localhost:1919';
const BASE_URL = location.hostname === 'localhost' ? LOCALHOST : PRODUCTION;

const collectedDataStore = writable({});

/**
 * Fetchable Data Store that collects that aggregates the incrementally loaded benchmarks
 */
export const dataStore = {
  ...collectedDataStore,
  /**
   * Load All Benchmarks at once
   * @returns {Promise<Object>}
   * @deprecated use incremental loading
   */
  loadAll: async () => {
    const results = await getAllScraped();
    collectedDataStore.set(results);
    return results;
  },

  /**
   * Incrementally load benchmarks for given ids
   * @param {Array<String>} ids the list of benchmark-timestamps ot load
   * @returns
   */
  loadBenchmarks: async (ids = []) => {
    const results = await getEntries(ids);
    const data = results.reduce((acc, entry) => {
      acc[entry.id] = entry.data;
      return acc;
    }, {});
    collectedDataStore.update(existing => ({
      ...existing,
      ...data
    }));
    return get(collectedDataStore);
  }
};

/**
 *Get The Full Scrape Data all at once
 * @returns {Promise<Object>}
 * @deprecated Use the incremental loader
 */
export async function getAllScraped() {
  return fetcher.get('/bench2/scrape_output.json');
}

/**
 * Get the Stat Properties
 * @returns {Promise<Object>}
 */
export async function getStatProperties() {
  return fetcher.get('/bench2/stat_properties.json');
}

/**
 * Get List of runs with relevant
 * @returns Promise<Array>
 */
export async function getRunIndex() {
  return fetcher.get('/bench2/run_index.json');
}

/**
 * Load a list of benchmark / timestamp entries
 * @returns Promise<Array>
 */
export async function getEntries(ids = []) {
  return Promise.all(ids.map(getEntry));
}

export async function getEntry(id) {
  return Cache.cache(id, async () => {
    const data = await fetcher.get(`/bench2/raw/${id}/results.json`);
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
  const aggregatedFetch = async (url, data = []) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.message);
    const next = await response.json();
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
const responseHandler = async response => {
  try {
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const withBaseUrl = url => `${BASE_URL}${('/' + url).replace('//', '/')}`;

const fetcher = {
  get: url => fetch(withBaseUrl(url)).then(responseHandler)
};

//----------------------------------------------------------------
// Git Hub Aggregation Helpers
//------------------------------------------------------------

const LINKS_MATCHER = /<?([^>]*)>(.*)/;
const LINKS_REL_MATCHER = /\s*(.+)\s*=\s*"?([^"]+)"?/;

function getRelKey(acc, p) {
  const m = p.match(LINKS_REL_MATCHER);
  if (m) acc[m[1]] = m[2];
  return acc;
}

function parseLink(string) {
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

export function extractLinks(links = '') {
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
