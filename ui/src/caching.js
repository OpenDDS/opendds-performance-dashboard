let enabled = true;

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

export const Cache = {
  cache: async (key, callback) => {
    if (enabled) {
      const existing = localStorage.getItem(key);
      if (existing) return JSON.parse(existing);
    }

    const data = await callback();

    if (enabled) setOrClear(key, data);

    return data;
  }
};
