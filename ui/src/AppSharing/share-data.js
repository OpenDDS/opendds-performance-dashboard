import {objectToQuery, queryToObject} from '../utility/url-builder';
import {IFrameShareLink} from './generators/IFrameShareLink';
import {WebsiteShareLink} from './generators/WebsiteShareLink';
import {
  MAX_TIMESTAMPS,
  MIN_TIMESTAMPS
} from '../AppTimestamps/timestamp-helpers';
const linkGenerators = [WebsiteShareLink, IFrameShareLink];

export function generateShareLink(location, options = {}) {
  return linkGenerators.map(generator => generator.generate(location, options));
}

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

export function updateBrowserHistory(data, updateUrl = true) {
  const sharable = {...data}; // Make a copy
  if (sharable.latest) {
    delete sharable.selectedTimestamps;
  }
  const query = objectToQuery(sharable);
  updateUrl && window.history.replaceState('', '', query);
}

export const getInitialData = (query = window.location.search) =>
  queryToObject(query);

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
