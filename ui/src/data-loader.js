import {writable, get} from 'svelte/store';
import {Cache, CACHE_TEN_MIN} from './caching';

const PRODUCTION = 'http://scoreboard.ociweb.com';
const LOCALHOST = 'http://localhost:1919';
const BASE_URL = location.hostname === 'localhost' ? LOCALHOST : PRODUCTION;

const collectedDataStore = writable({});

export const dataStore = {
  ...collectedDataStore,
  loadAll: async () => {
    const results = await getAllScraped();
    collectedDataStore.set(results);
    return results;
  },
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

export async function getAllScraped() {
  return fetcher.get('/bench2/scrape_output.json');
}

export async function getStatProperties() {
  return fetcher.get('/bench2/stat_properties.json');
}

export async function getRunIndex() {
  return fetcher.get('/bench2/run_index.json');
}

export async function getEntries(ids = []) {
  return Promise.all(ids.map(getEntry));
}

export async function getEntry(id) {
  return Cache.cache(id, async () => {
    const data = await fetcher.get(`/bench2/raw/${id}/results.json`);
    return {id: id, data};
  });
}

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
