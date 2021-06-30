/**
 * The String to represent that the url query parameter's value
 * should be an array
 * @example
 * ```
 * ?key[]=hello&key[]=world
 * would be deserialized as {key: ["hello", "world"]}
 * ```
 */
const ARRAY_SYMBOLIZER = '[]';

/**
 * Convert an object to a url encoded query string
 * @param {Object} The object to conver
 * @returns
 */
export function objectToQuery(object = {}) {
  return (
    '?' +
    Object.entries(object)
      .reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(value =>
              acc.push(`${key}${ARRAY_SYMBOLIZER}=${encodeURIComponent(value)}`)
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

/**
 * Convert a Query string to an Object
 * @param {String} query The Query String
 * @returns
 */
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
      if (key.endsWith(ARRAY_SYMBOLIZER)) {
        const cleanKey = key.replace(ARRAY_SYMBOLIZER, '');
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
