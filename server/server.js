// This is only used for running the app locally.

const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const {getData} = require('./scrape');

const app = express();
app.use(cors());

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
app.get('/bench2/timestamps.json', async (req, res) => {
  if(isDev) {
    const json = require('./public/open-dds-commits.json')
    return res.json(json)
  }
  fetchJson('http://scoreboard.ociweb.com/bench2/scrape_output.json', res);
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/bench2/scrape_output.json', async (req, res) => {
  if(isDev) {
    const json = require('./public/open-dds-statistics.json')
    return res.json(json)
  }
  fetchJson('http://scoreboard.ociweb.com/bench2/scrape_output.json', res);
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/bench2/stat-properties.json', async (req, res) => {  
  if(isDev) {
    const json = require('./public/stat-properties.json')
    console.log(json)
    return res.json(json)
  }    
  fetchJson('http://scoreboard.ociweb.com/bench2/stat_properties.json', res);
});

app.get('/bench2/raw/:timestamp/results.json', async (req, res) => {
  const {timestamp} = req.params
  console.log({timestamp, query: req.params})
  if(isDev) {
    return fetchJson(`http://localhost:${PORT}/data/${timestamp}/results.json`, res);
  }
  fetchJson(`http://scoreboard.ociweb.com/bench2/raw/${timestamp}/results.json`, res);
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

async function fetchJson(url, res) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      res.end(JSON.stringify(data));
    } else {
      throw new Error(await response.text());
    }
  } catch (e) {
    res.status(500).end(e.message);
  }
}

const PORT = 1919;
app.listen(PORT, () => console.info('browse http://localhost:' + PORT));
