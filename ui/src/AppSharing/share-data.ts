import {objectToQuery, queryToObject} from '../utility/url-builder';
import {IFrameShareLink} from './generators/IFrameShareLink';
import {WebsiteShareLink} from './generators/WebsiteShareLink';
import {MAX_TIMESTAMPS} from '../AppTimestamps/timestamp-helpers';
import type {ShareLink, ShareLinkOptions} from './generators/ShareLink';
import type {FormConfiguration, TimestampViewModel} from '../types';

export type InitialDataValidationConfig = {
  initialData: Partial<FormConfiguration>;
  timestamps: TimestampViewModel[];
  defaultCount: number;
};

export type ValidationResults = {
  /**
   * Any valid piece of form data.
   */
  validated: Partial<FormConfiguration>;

  /**
   * The Message, if any, of the error
   */
  error?: string;
};

const linkGenerators: typeof ShareLink[] = [WebsiteShareLink, IFrameShareLink];
/**
 * Generate an Array of Share Links based on the available drivers
 * @param {String} url the url to share
 * @param {*} options additional configuration options
 * @returns {Array} Array of ShareLink entities
 */
export function generateShareLinks(
  url: string,
  options: ShareLinkOptions = {}
): ShareLink[] {
  return linkGenerators.map(generator => generator.generate(url, options));
}

/**
 * Update the site to update the style to accomidate iFrame embedding
 * @param  opts configuration options
 * @returns Configuration information
 */
export function configureEmbedding(opts: ShareLinkOptions) {
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
 */
export function updateBrowserHistory(
  formData: FormConfiguration,
  updateUrl: boolean = true
): void {
  const sharable = {...formData}; // Make a copy
  if (sharable.latest) {
    delete sharable.selectedTimestamps;
  }
  const query = objectToQuery(sharable);
  updateUrl && window.history.replaceState('', '', query);
}

/**
 * Extract the initial share data based on a query string
 * @param query query string
 * @returns
 */
export const getInitialData = (
  query: string = window.location.search
): Partial<FormConfiguration> => queryToObject(query);

/**
 * Get Validated Data
 */
export function getValidatedInitialData({
  initialData = {},
  timestamps = [],
  defaultCount = 2
}: InitialDataValidationConfig): ValidationResults {
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

  if (initialData.latest && !isNaN(initialData.latest)) {
    const latest = Math.min(initialData.latest, MAX_TIMESTAMPS);
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

  const onError = (message: string | null) => {
    return {
      error: message,
      validated: {selectedTimestamps: maybeSelected()}
    };
  };

  if (!keys.length) {
    return onError(null);
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
    return onError(
      `Some of the requested benchmarks are not longer available, resetting to the latest ${defaultCount} benchmarks.`
    );
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
