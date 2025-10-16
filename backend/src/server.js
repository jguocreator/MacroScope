const express = require('express');
const cors = require('cors');
const { loadAllData, getTimeseries } = require('./dataProcessor');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/timeseries', (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { startDate, endDate, frequency } = req.query;

  const fullSeries = getTimeseries(frequency);

  let series = fullSeries;
  if (startDate) {
    series = series.filter(p => new Date(p.date) >= new Date(startDate));
  }

  if (endDate) {
    series = series.filter(p => new Date(p.date) <= new Date(endDate));
  }

  const lastPoint = series.length > 0 ? series[series.length - 1] : null;

  res.json({
    xLabel: 'Core PCE (YoY Growth) (%)',
    yLabel: 'Real GDP (YoY) (%)',
    origin: lastPoint ? lastPoint.origin : { x: 0, y: 0 },
    series: series.map(p => ({ date: p.date, x: p.x, y: p.y }))
  });
});

async function startServer() {
  await loadAllData(); // Load and process data before starting the server

  app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
  });
}

startServer();
