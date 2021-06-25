let enabled = true;

export const Cache = {
  cache: async (key, callback) => {
    if (enabled) {
      const existing = localStorage.getItem(key);
      if (existing) return JSON.parse(existing);
    }
    const data = await callback();

    if (enabled) localStorage.setItem(key, JSON.stringify(data));

    return data;
  }
};
