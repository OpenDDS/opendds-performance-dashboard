export function objectToQuery(object = {}) {
  return (
    '?' +
    Object.entries(object)
      .reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(value =>
              acc.push(`${key}[]=${encodeURIComponent(value)}`)
            );
          } else {
            acc.push(`${key}=${encodeURIComponent(value)}`);
          }
        }
        return acc;
      }, [])
      .join('&')
  );
}

export function queryToObject(query = '') {
  if (typeof query !== 'string' || !query.includes('=')) {
    return {};
  }
  return query
    .replace('?', '')
    .split('&')
    .reduce((acc, part) => {
      const [key, value] = part.split('=');
      const deserialized = decodeValue(value);
      if (key.endsWith('[]')) {
        const cleanKey = key.replace('[]', '');
        if (!Array.isArray(acc[cleanKey])) {
          acc[cleanKey] = [];
        }
        acc[cleanKey].push(deserialized);
      } else {
        acc[key] = deserialized;
      }
      return acc;
    }, {});
}

function decodeValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value)) return new Number(value).valueOf();
  return decodeURIComponent(value);
}
