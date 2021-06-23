import {writable} from 'svelte/store';

const BASE_URL = location.hostname === 'localhost'
      ? 'http://localhost:1919'
      : 'http://scoreboard.ociweb.com';

const collectedDataStore = writable(
  {}
);

export const collectedData = {
  ...collectedDataStore,
  loadAll: async () => {
      const results = await getAllScraped()
      collectedData.set(results)
  },
  loadTests: async (ids = []) => {
    const results = await getEntries(ids);
    results.reduce((acc, entry) => {
      acc[entry.id] = entry.data;
      return acc
    }, {});
    collectedDataStore.updateData(existing => ({
        ...existing,
        ...results,
      })
    );
  }
};

const Cache = {
  cache: async (key, callback) => {
    const existing = localStorage.getItem(key);
    if (existing) return JSON.parse(existing);
    const data = await callback();
    localStorage.setItem(JSON.stringify(data));
    return data;
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

const withBaseUrl = (url) =>  `${BASE_URL}${("/" + url).replace("//", "/")}`

const fetcher = {
  get: url => fetch(withBaseUrl(url)).then(responseHandler)
};

export async function getAllScraped() {
  return fetcher.get('/bench2/scrape_output.json');
}

export async function getTestList() {
  return fetcher.get('/bench2/stat-properties.json');
}

export async function getEntries(ids = []) {
  return Promise.all(ids.map(getEntry));
}

export async function getEntry(id) {
  return Cache.cache(id, async () => {
    const data = await fetcher.get(`/bench2/raw/${id}/result.json`);
    return {id: id, data};
  });
}
