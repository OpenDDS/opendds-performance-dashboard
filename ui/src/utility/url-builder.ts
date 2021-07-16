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

type EncodableValue = string | number | boolean;
type EncodableArray = EncodableValue[];
type EncodableType = EncodableValue | EncodableArray;

/**
 * Decode Value and cast if approperiate
 * @param value
 * @returns
 */
function decodeValue(value: string): EncodableValue {
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
export function objectToQuery(
  object: Record<string, EncodableType> = {}
): string {
  return (
    '?' +
    Object.entries(object || {})
      .reduce((acc, [key, value]: [string, EncodableType]): string[] => {
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
      }, <string[]>[])
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

/**
 * Resolve the api url based on the current window location
 * @param location Window Location
 * @returns
 */
export function resolveApiUrl(location: Location): string {
  const PRODUCTION = `${location.origin}${location.pathname}`;
  const LOCALHOST_PORT = 1919;
  const LOCALHOST = `${location.protocol}//${
    location.hostname
  }:${LOCALHOST_PORT}${trimTrailingSlashes(location.pathname)}/bench2`;

  return trimTrailingSlashes(
    location.hostname === 'localhost' ? LOCALHOST : PRODUCTION
  );
}

/**
 * Trim trailing slashes off a given url
 * @example
 * ```
 * given http://test.com/
 * or given http://test.com/////
 * 
 * output http://test.com
 * 

 * ```
 * @param url The original url string
 * @returns 
 */
export function trimTrailingSlashes(url: string): string {
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}
