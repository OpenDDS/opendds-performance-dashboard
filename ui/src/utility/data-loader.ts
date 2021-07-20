import type {
  AppError,
  Benchmark,
  BenchmarkIdentifier,
  Benchmarks,
  GitHubTag,
  RunIndex,
  StatProperties
} from '../types';
import {Cache, CACHE_TEN_MIN} from './caching';
import {resolveApiUrl} from './url-builder';

const BASE_URL = resolveApiUrl(window.location);

class AppErrorImpl extends Error implements AppError {
  key?: string;

  static make(error: Error, key: string): AppError {
    const err = new this(error.message);
    err.key = key;
    return err;
  }
}

export type BenchmarkEntry = {
  id: BenchmarkIdentifier;
  data: Benchmark;
};

export type BenchmarkLoadResponse = {
  results: Benchmarks;
  errors: AppError[];
};

export type BenchmarkEntriesResponse = {
  results: BenchmarkEntry[];
  errors: AppError[];
};

/**
 * Get The Full Scrape Data all at once
 */
export async function getAllScraped(): Promise<Benchmarks> {
  return fetcher.get<Benchmarks>('/scrape_output.json');
}

/**
 * Get the Stat Properties
 */
export async function getStatProperties(): Promise<StatProperties> {
  return fetcher.get<StatProperties>('/stat_properties.json');
}

/**
 * Get List of runs with relevant
 */
export async function getRunIndex(): Promise<RunIndex> {
  return fetcher.get<RunIndex>('/run_index.json');
}

/**
 * Load a list of benchmark / timestamp entries
 */
export async function getEntries(
  ids: BenchmarkIdentifier[] = []
): Promise<BenchmarkEntriesResponse> {
  const data = await Promise.all(
    ids.map<Promise<BenchmarkEntry | AppErrorImpl>>(i =>
      getEntry(i).catch(e => AppErrorImpl.make(e, i))
    )
  );

  const collector: BenchmarkEntriesResponse = {
    results: [],
    errors: []
  };

  return data.reduce((acc, response) => {
    if (response instanceof AppErrorImpl) acc.errors.push(response);
    else acc.results.push(response);
    return acc;
  }, collector);
}

export async function getEntry(
  id: BenchmarkIdentifier
): Promise<BenchmarkEntry> {
  return Cache.cache(id, async () => {
    const data: Benchmark = await fetcher.get(`/raw/${id}/results.json`);
    return {id: id, data};
  });
}

/**
 * Load GitHub Tags for the OpenDDS Repo
 * @returns Promise<Array>
 */
export async function getGitTags(): Promise<GitHubTag[]> {
  const url =
    'https://api.github.com/repos/objectcomputing/OpenDDS/tags?per_page=100';
  const aggregatedFetch = async (
    url: string,
    data: GitHubTag[] = []
  ): Promise<GitHubTag[]> => {
    const response = await fetch(url);

    if (!response.ok) {
      const {message} = <{message: string}>(
        await response.json().catch(() => ({message: 'Something went wrong'}))
      );
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
const fetcher = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(withBaseUrl(url));
    return responseHandler(response);
  }
};

async function responseHandler<T>(response: Response) {
  try {
    if (!response.ok) {
      const json = (await response.json()) as {message: string};
      throw new Error(json.message || 'Something Went Wrong');
    }
    return <T>await response.json();
  } catch (error) {
    throw new Error((<Error>error).message);
  }
}

const withBaseUrl = (url: string) =>
  `${BASE_URL}${('/' + url).replace('//', '/')}`;

//----------------------------------------------------------------
// Git Hub Aggregation Helpers
//------------------------------------------------------------

const LINKS_MATCHER = /<?([^>]*)>(.*)/;
const LINKS_REL_MATCHER = /\s*(.+)\s*=\s*"?([^"]+)"?/;

function getRelKey(acc: Record<string, string>, p: string) {
  const m = LINKS_REL_MATCHER.exec(p);
  if (m) acc[m[1]] = m[2];
  return acc;
}

function parseLink(string: string): Record<string, string> | null {
  try {
    const matches = LINKS_MATCHER.exec(string);
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
