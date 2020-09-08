const cors = require('cors');
const express = require('express');
const {getData} = require('./scrape');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// An example value for name is 'echo_rtps'.
// An example value for statType is 'Latency'.
app.get('/:name/:statType', async (req, res) => {
  const {name, statType} = req.params;
  const data = await getData(name, statType);
  res.send(JSON.stringify(data));
});

const PORT = 1919;
app.listen(PORT, () => console.log('browse http://localhost:' + PORT));
