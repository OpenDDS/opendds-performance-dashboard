const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const {getData} = require('./scrape');

const app = express();
app.use(cors());

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// An example value for name is 'echo_rtps'.
// An example value for statType is 'Latency'.
app.get('/:dsName/:statType', async (req, res) => {
  const {dsName, statType} = req.params;
  const data = await getData(dsName, statType);
  res.send(JSON.stringify(data));
});

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
app.listen(PORT, () => console.log('browse http://localhost:' + PORT));
