let enabled = true;
export const CACHE_ONE_MIN = 1000 * 60;
export const CACHE_TEN_MIN = CACHE_ONE_MIN * 10;
export const CACHE_THIRTY_MIN = CACHE_ONE_MIN * 30;
export const CACHE_ONE_HOUR = CACHE_ONE_MIN * 60;
export const CACHE_ONE_DAY = CACHE_ONE_HOUR * 24;
export const CACHE_ONE_WEEK = CACHE_ONE_DAY * 7;

function setOrClear(key, data, tried = false) {
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

class ExpiringEntity {
  constructor({data, createdAt}) {
    this.data = data;
    this.createdAt = createdAt;
    this.__is_expiring_storage_record = true;
  }

  static make(data) {
    const createdAt = Date.now();
    return new ExpiringEntity({data, createdAt});
  }

  static isExpired({createdAt, __is_expiring_storage_record}, ttl) {
    if (__is_expiring_storage_record !== true) return true;
    if (ttl === undefined || createdAt === undefined) return true;
    return Date.now() > createdAt + ttl;
  }
}

export const Cache = {
  /**
   * Get locally cahced data, or fetch and cache.
   *
   * @param {String} key the caching key
   * @param {Function<Object>} callback callback returning promise that results in data to cache.
   * @returns
   */
  cache: async (key, callback) => {
    if (enabled) {
      try {
        const existing = localStorage.getItem(key);
        if (existing) return JSON.parse(existing);
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
  expiring: async (ttl = CACHE_ONE_HOUR, key, callback) => {
    if (enabled) {
      const existing = localStorage.getItem(key);
      if (existing) {
        try {
          const entity = JSON.parse(existing);
          if (!ExpiringEntity.isExpired(entity, ttl)) {
            return entity.data;
          }
        } catch (error) {
          console.warn('Error checking expiring storage', error.message);
        }
      }
    }

    const data = await callback();
    if (enabled) {
      setOrClear(key, ExpiringEntity.make(data, ttl));
    }

    return data;
  }
};
