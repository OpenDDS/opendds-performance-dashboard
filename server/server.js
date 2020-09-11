const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const {getData} = require('./scrape');

const app = express();
app.use(cors());

// This serves a JSON file that was saved for test purposes.
app.use(express.static(path.resolve(__dirname, 'public')));

// This is just for smoke testing to verify that the server is running.
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// This scrapes data for a specific scenario and statistics type
// from HTML pages at runtime.
// An example value for scenario is 'echo_rtps'.
// An example value for statType is 'Latency'.
app.get('/:scenario/:statType', async (req, res) => {
  const {scenario, statType} = req.params;
  const data = await getData(scenario, statType);
  res.send(JSON.stringify(data));
});

// This retrieves the JSON data at a specific URL.
// It is needed to work around CORS issues
// because the client cannot directly fetch this URL.
app.get('/data', async (req, res) => {
  //const url = 'http://scoreboard.ociweb.com/bench2/scrape_output.json';
  const url = 'http://localhost:1919/open-dds-statistics.json';
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
});

const PORT = 1919;
app.listen(PORT, () => console.info('browse http://localhost:' + PORT));
