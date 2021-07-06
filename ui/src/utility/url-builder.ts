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
 * Decode Value and cast if approperiate
 * @param value
 * @returns
 */
function decodeValue(value: string) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  const numVal = new Number(value).valueOf();
  if (!isNaN(numVal)) return numVal;
  return decodeURIComponent(value);
}

/**
 * Convert an object to a url encoded query string
 * @param {Object} The object to conver
 * @returns
 */
export function objectToQuery(object: Record<string, unknown> = {}): string {
  return (
    '?' +
    Object.entries(object)
      .reduce((acc, [key, value]): string[] => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(value =>
              acc.push(`${key}${ARRAY_SYMBOLIZER}=${encodeURIComponent(value)}`)
            );
          } else {
            acc.push(`${key}=${encodeURIComponent(value.toString())}`);
          }
        }
        return acc;
      }, [])
      .join('&')
  );
}

type Primitive = string | number | boolean;
type PrimitiveArray = Array<string | number | boolean>;

/**
 * Convert a Query string to an Object
 * @param query The Query String
 * @returns
 */
export function queryToObject(
  query = ''
): Record<string, Primitive | PrimitiveArray> {
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
        (<PrimitiveArray>acc[cleanKey]).push(deserialized);
      } else {
        acc[key] = deserialized;
      }
      return acc;
    }, <Record<string, Primitive | PrimitiveArray>>{});
}
