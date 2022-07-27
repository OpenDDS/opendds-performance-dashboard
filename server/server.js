// This is only used for running the app locally.

import {default as fetch} from 'node-fetch';
import {default as cors} from 'cors';
import {default as express} from 'express';
import {default as path} from 'path';
import {default as url} from 'url';
import * as getData from './scrape.js';

const app = express();
app.use(cors());

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const isDev = process.argv[process.argv.length - 1] === '--dev';

// This serves a JSON file that was saved for test purposes.
app.use(express.static(path.resolve(__dirname, 'public')));

// This is just for smoke testing to verify that the server is running.
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/bench2/run_index.json', async (req, res) => {
  // TODO: This file isn't created on prod yet,
  //       So we need to unwind this before deploy.
  if (isDev) {
    const json = require('./public/mocking/run_index.json');
    return res.json(json);
  }
  fetchRemote('/bench2/run_index.json', res);
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/bench2/scrape_output.json', async (req, res) => {
  if (isDev) {
    const json = require('./public/open-dds-statistics.json');
    return res.json(json);
  }
  fetchRemote('/bench2/scrape_output.json', res);
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/bench2/stat_properties.json', async (req, res) => {
  if (isDev) {
    return fetchLocal('/stat_properties.json', res);
  }
  fetchRemote('/bench2/stat_properties.json', res);
});

app.get('/bench2/raw/:id/results.json', async (req, res) => {
  const {id} = req.params;
  if (isDev) {
    return fetchLocal(`/raw/${id}/results.json`, res);
  }
  fetchRemote(`/bench2/raw/${id}/results.json`, res);
});

// This scrapes data for a specific scenario and statistics type
// from HTML pages at runtime.
// An example value for scenario is 'echo_rtps'.
// An example value for statType is 'Latency'.
app.get('/data/:scenario/:statType', async (req, res) => {
  const {scenario, statType} = req.params;
  const data = await getData(scenario, statType);
  res.send(JSON.stringify(data));
});

async function fetchLocal(path, res) {
  return fetchJson(`http://localhost:${PORT}/mocking${path}`, res);
}

async function fetchRemote(path, res) {
  return fetchJson(`http://scoreboard.ociweb.com${path}`, res);
}

async function fetchJson(url, res) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      throw new Error(await response.text());
    }
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

const PORT = 1919;
app.listen(PORT, () => console.info('browse http://localhost:' + PORT));
