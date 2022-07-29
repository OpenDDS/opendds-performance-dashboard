import {objectToQuery, queryToObject} from '../utility/url-builder';
import {ShareLinkGeneratorIFrame} from './generators/ShareLinkIFrame';
import {ShareLinkGeneratorWebsite} from './generators/ShareLinkWebsite';
import {MAX_TIMESTAMPS} from '../AppTimestamps/timestamp-helpers';
import type {
  Sharable,
  ShareLinkGenerator,
  ShareLinkOptions
} from './generators/ShareLink';
import type {
  BenchmarkIdentifier,
  FormConfiguration,
  FormConfigurationKeys,
  TimestampViewModel
} from '../types';

/**
 * The shape of initial data parsed from Query
 * This is a union of the form and the selected timestamps
 */
export type InitialData = Partial<FormConfiguration> & {
  selectedTimestamps?: BenchmarkIdentifier[];
};

export type InitialDataValidationConfig = {
  initialData: InitialData;
  timestamps: TimestampViewModel[];
  defaultCount: number;
};

export type ValidationResults = {
  /**
   * Any valid piece of form data.
   */
  validated: Partial<FormConfiguration>;

  /**
   * The Selected Timestamps
   */
  selected: BenchmarkIdentifier[];

  /**
   * The Message, if any, of the error
   */
  error?: string;
};

//----------------------------------------------------------------
// Share Links
//------------------------------------------------------------
/**
 * The array of Share Link Generators to display
 */
const LINK_GENERATORS: ShareLinkGenerator[] = [
  ShareLinkGeneratorWebsite,
  ShareLinkGeneratorIFrame
];

/**
 * Update the site to update the style to accomidate iFrame embedding
 * @param  opts configuration options
 * @returns Configuration information
 */
export function configureEmbedding(opts: ShareLinkOptions): {
  isEmbedded: boolean;
} {
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
 * Generate an Array of Share Links based on the available drivers
 * @param {String} url the url to share
 * @param {*} options additional configuration options
 * @returns {Array} Array of ShareLink entities
 */
export function generateShareLinks(
  url: string,
  options: ShareLinkOptions = {}
): Sharable[] {
  return LINK_GENERATORS.map(generator => generator.generate(url, options));
}

/**
 * Extract the initial share data based on a query string
 * @param query query string
 * @returns
 */
export const getInitialData = (
  query: string = window.location.search
): InitialData => queryToObject(query);

/**
 * Return a set of validated data, and any errors collected during validation.
 *
 * @note This is split of from getInitialData in order for
 *       Additional data points to be loaded that determine
 *       what are valid data points.
 */
export function getValidatedInitialData({
  initialData = {},
  timestamps = [],
  defaultCount = 2
}: InitialDataValidationConfig): ValidationResults {
  /**
   * Function to Grab the fallback selected timestamps
   */
  const defaultSelected = (): BenchmarkIdentifier[] => {
    const start = timestamps.length - defaultCount;
    return timestamps.filter((_, idx) => idx > start).map(t => t.key);
  };

  /**
   * Function to determine if ALL requested timestamps exists
   */
  const requestedTimestampsExist = (): boolean => {
    if (!Array.isArray(selectedTimestamps)) return false;
    return selectedTimestamps.every(key =>
      timestamps.find(ts => ts.key === key)
    );
  };

  /**
   * Utility function to return an error response
   * @param message the error message
   * @param validated any configuraiton that has passed validation
   */
  const onError = (
    message: string | null,
    validated: Partial<FormConfiguration> = {}
  ) => {
    return {
      error: message,
      selected: defaultSelected(),
      validated
    };
  };

  /** Required Form Keys, if any are missing the entire thing is in error */
  const required: FormConfigurationKeys[] = [
    'scenario',
    'plotType',
    'statName',
    'chartType',
    'useTimeSeries',
    'useLogScale'
  ];

  /**
   * Optional keys
   */
  const optional: FormConfigurationKeys[] = ['serverCount', 'latest'];

  // spread out timestamps from form configuration
  /* eslint-disable-next-line prefer-const */
  let {selectedTimestamps, ...unvalidated} = initialData;

  if (unvalidated.latest && !isNaN(unvalidated.latest)) {
    const latest = Math.min(unvalidated.latest, MAX_TIMESTAMPS);
    selectedTimestamps = timestamps
      .slice(timestamps.length - latest, timestamps.length)
      .map(t => t.key);
  }

  const keys = Object.keys(unvalidated).filter((key: FormConfigurationKeys) =>
    required.includes(key)
  );

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

  const collector: Partial<FormConfiguration> = {};
  const validated = [...keys, ...optional].reduce(
    (acc: Record<string, unknown>, key: FormConfigurationKeys) => {
      const value = unvalidated[key];
      if (value) acc[key] = value;
      return acc;
    },
    collector
  );

  if (!selectedTimestamps || !selectedTimestamps.length) {
    return onError(
      `No benchmarks were requests in the suplied link. resetting to the latest ${defaultCount} benchmarks.`,
      validated
    );
  }

  if (!requestedTimestampsExist()) {
    return onError(
      `Some of the requested benchmarks are not longer available, resetting to the latest ${defaultCount} benchmarks.`,
      validated
    );
  }

  return {
    error: null,
    selected: selectedTimestamps,
    validated
  };
}

/**
 * Update the browser URL based on the form data
 */
export function updateBrowserHistory(
  formData: FormConfiguration,
  selectedTimestamps: BenchmarkIdentifier[],
  updateUrl = true
): void {
  const sharable: InitialData = {...formData}; // Make a copy
  if (!sharable.latest) {
    sharable.selectedTimestamps = selectedTimestamps;
  }
  const query = objectToQuery(sharable);
  updateUrl && window.history.replaceState('', '', query);
}
