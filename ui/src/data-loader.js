import {writable, get} from 'svelte/store';
import {Cache} from './caching';

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

export async function getTimestamps() {
  return fetcher.get('/bench2/timestamps.json');
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
