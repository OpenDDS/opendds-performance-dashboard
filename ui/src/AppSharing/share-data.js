import {objectToQuery, queryToObject} from '../utility/url-builder';
import {IFrameShareLink} from './generators/IFrameShareLink';
import {WebsiteShareLink} from './generators/WebsiteShareLink';
import {MAX_TIMESTAMPS} from '../AppTimestamps/timestamp-helpers';
const linkGenerators = [WebsiteShareLink, IFrameShareLink];

/**
 * Generate an Array of Share Links based on the available drivers
 * @param {String} url the url to share
 * @param {*} options additional configuration options
 * @returns {Array} Array of ShareLink entities
 */
export function generateShareLinks(url, options = {}) {
  return linkGenerators.map(generator => generator.generate(url, options));
}

/**
 * Update the site to update the style to accomidate iFrame embedding
 * @param {Object} opts configuration options
 * @returns
 */
export function configureEmbedding(opts) {
  const {embed, text_color} = opts;
  const isEmbedded = embed === 'iframe';
  if (embed === 'iframe') {
    document.body.classList.remove('stylized');
    document.body.classList.add('embedded');
    document.body.style.setProperty('--bg-color', 'transparent');
  }
  if (text_color) {
    document.body.style.setProperty('--text-color', text_color);
  }
  return {
    isEmbedded
  };
}

/**
 * Update the browser URL based on the form data
 * @param {Object} formData
 * @param {Boolean} updateUrl
 */
export function updateBrowserHistory(formData, updateUrl = true) {
  const sharable = {...formData}; // Make a copy
  if (sharable.latest) {
    delete sharable.selectedTimestamps;
  }
  const query = objectToQuery(sharable);
  updateUrl && window.history.replaceState('', '', query);
}

/**
 * Extract the initial share data based on a query string
 * @param {String} query query string
 * @returns
 */
export const getInitialData = (query = window.location.search) =>
  queryToObject(query);

/**
 *
 * @param {Object} param0 Data used to determine if initial data is valid
 * @returns {Object} Object with two keys
 *                       error : the error string,
 *                       validated : any valid keys to be applied to the data
 */
export function getValidatedInitialData({
  initialData = {},
  timestamps = [],
  defaultCount = 2
}) {
  const required = [
    'scenario',
    'plotType',
    'statName',
    'chartType',
    'useTimeSeries',
    'useLogScale',
    'selectedTimestamps'
  ];

  const optional = ['serverCount', 'latest'];

  if (!isNaN(initialData.latest)) {
    const latest = Math.min(parseInt(initialData.latest), MAX_TIMESTAMPS);
    initialData.selectedTimestamps = timestamps
      .slice(timestamps.length - latest, timestamps.length)
      .map(t => t.key);
  }

  const keys = Object.keys(initialData).filter(key => required.includes(key));

  const start = timestamps.length - defaultCount;

  const maybeSelected = () =>
    timestamps.filter((_, idx) => idx > start).map(t => t.key);

  const requestedTimestampsExist = () => {
    if (!Array.isArray(initialData.selectedTimestamps)) return false;
    return initialData.selectedTimestamps.every(key =>
      timestamps.find(ts => ts.key === key)
    );
  };

  const onError = message => {
    return {
      error: message,
      validated: {selectedTimestamps: maybeSelected()}
    };
  };

  if (!keys.length) {
    return onError();
  }

  const missing = required.filter(i => {
    return !keys.includes(i);
  });

  if (missing.length) {
    return onError(
      `There appears to be required parameters missing from the link: ${missing.toString()}`
    );
  }

  if (!requestedTimestampsExist()) {
    return onError('Some of the requested benchmarks are not longer available');
  }

  return {
    error: null,
    validated: {
      ...[...keys, ...optional].reduce((acc, key) => {
        const value = initialData[key];
        if (value) acc[key] = value;
        return acc;
      }, {})
    }
  };
}
