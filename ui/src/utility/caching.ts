let enabled = true;

//----------------------------------------------------------------
// Cache Durations
//------------------------------------------------------------
export const CACHE_ONE_MIN = 1000 * 60;
export const CACHE_TEN_MIN = CACHE_ONE_MIN * 10;
export const CACHE_THIRTY_MIN = CACHE_ONE_MIN * 30;
export const CACHE_ONE_HOUR = CACHE_ONE_MIN * 60;
export const CACHE_ONE_DAY = CACHE_ONE_HOUR * 24;
export const CACHE_ONE_WEEK = CACHE_ONE_DAY * 7;

//----------------------------------------------------------------
// Related Types
//------------------------------------------------------------
type CacheCallback<T> = () => Promise<T>;
type ExpiringEntityType<T> = {
  data: T;
  createdAt: number;
  __is_expiring_storage_record: boolean;
};

/**
 * Set the cache value.  If the local storage has been filled up due
 * to legacy stale data, clear all of it.
 * @param key the cache key
 * @param data the data to be cached
 * @param tried wheter clearing has already been tried
 */
function setOrClear<T>(key: string, data: T, tried = false): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    if (
      !tried &&
      error.QUOTA_EXCEEDED_ERR &&
      error.code === error.QUOTA_EXCEEDED_ERR
    ) {
      localStorage.clear();
      return setOrClear(key, data, true);
    }
    throw error;
  }
}

class ExpiringEntity<T> implements ExpiringEntityType<T> {
  data: T;
  createdAt: number;
  __is_expiring_storage_record: boolean;

  constructor({data, createdAt}: {data: T; createdAt: number}) {
    this.data = data;
    this.createdAt = createdAt;
    this.__is_expiring_storage_record = true;
  }

  static make<T>(data: T) {
    const createdAt = Date.now();
    return new ExpiringEntity({data, createdAt});
  }

  static isExpired(
    {createdAt, __is_expiring_storage_record}: Partial<ExpiringEntity<any>>,
    ttl: number
  ): boolean {
    if (__is_expiring_storage_record !== true) return true;
    if (ttl === undefined || createdAt === undefined) return true;
    return Date.now() > createdAt + ttl;
  }
}

interface CacheInterface {
  cache: <T>(key: string, callback: CacheCallback<T>) => Promise<T>;
  expiring: <T>(
    ttl: number,
    key: string,
    callback: CacheCallback<T>
  ) => Promise<T>;
}

export const Cache: CacheInterface = {
  /**
   * Get locally cahced data, or fetch and cache.
   *
   * @param {String} key the caching key
   * @param {Function<Object>} callback callback returning promise that results in data to cache.
   * @returns
   */
  cache: async <T>(key: string, callback: CacheCallback<T>) => {
    if (enabled) {
      try {
        const existing = localStorage.getItem(key);
        if (existing) return <T>JSON.parse(existing);
      } catch (error) {
        console.warn('Error checking expriing storage', error.message);
      }
    }

    const data = await callback();

    if (data && enabled) setOrClear(key, data);

    return data;
  },

  /**
   * Get locally cahced data, or fetch and cache if data doesn't exist or is stale.
   *
   * @param {String} key the caching key
   * @param {Function<Object>} callback callback returning promise that results in data to cache.
   * @returns
   */
  expiring: async <T>(
    ttl = CACHE_ONE_HOUR,
    key: string,
    callback: CacheCallback<T>
  ) => {
    if (enabled) {
      const existing = localStorage.getItem(key);
      if (existing) {
        try {
          const entity = JSON.parse(existing);
          if (!ExpiringEntity.isExpired(entity, ttl)) {
            return <T>entity.data;
          }
        } catch (error) {
          console.warn('Error checking expiring storage', error.message);
        }
      }
    }
    const data = await callback();
    if (enabled) {
      setOrClear(key, ExpiringEntity.make<T>(data));
    }
    return data;
  }
};
