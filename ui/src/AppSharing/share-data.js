import {objectToQuery, queryToObject} from '../utility/url-builder';
import {IFrameShareLink} from './generators/IFrameShareLink';
import {WebsiteShareLink} from './generators/WebsiteShareLink';

const linkGenerators = [WebsiteShareLink, IFrameShareLink];

export function updateBrowserHistory(data, updateUrl = true) {
  const query = objectToQuery(data);
  updateUrl && window.history.replaceState('', '', query);
}

export function generateShareLink(location) {
  return linkGenerators.map(generator => generator.generate(location));
}

export const getInitialData = (query = window.location.search) =>
  queryToObject(query);

export function getValidatedInitialData({
  initialData,
  timestamps,
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
  const optional = ['serverCount'];

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
    if (message) alert(message);
    return {
      selectedTimestamps: maybeSelected()
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
    ...[...keys, ...optional].reduce((acc, key) => {
      const value = initialData[key];
      if (value) acc[key] = value;
      return acc;
    }, {})
  };
}
