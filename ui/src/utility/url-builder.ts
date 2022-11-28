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
 * @param {Object} object The object to convert
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
  const DEV_PROXY_API_PORT = 1919;
  const LOCALHOST_DEV = ['3000', '5000', '5173'];

  function isDev({hostname, port}): boolean {
    const local = hostname === 'localhost' || hostname.substr(0, 4) === '127.';
    const result = local && LOCALHOST_DEV.includes(port);
    return result;
  }

  const cleanedPath = trimTrailingSlashes(
    stripHtmFilenameFromPath(location.pathname)
  );

  const LOCALHOST = `${location.protocol}//${location.hostname}:${DEV_PROXY_API_PORT}${cleanedPath}/bench2`;
  const PRODUCTION = `${location.origin}${cleanedPath}`;

  return isDev(location) ? LOCALHOST : PRODUCTION;
}

/**
 * If the path provided is an .html file and not a directory
 * strip the file name off the end and return the path.
 *
 * Note: If the url given ends in a slash it will not
 * alter that path.
 *
 * @example
 * ```
 * given: /test/com/index.html
 * output: /test/com/
 *
 * This is offered as a directory
 * given: /test/com/index.html/
 * output: /test/com/index.html/
 * ```
 *
 * @param path the location path
 * @returns the cleaned location path
 */
export function stripHtmFilenameFromPath(path: string): string {
  if (!path.endsWith('.html')) return path;

  const parts = path.split('/');
  parts.pop(); // pop the index.html off the end
  if (!parts.length && !path.startsWith('/')) return '';
  return parts.join('/') + '/';
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
