const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

const METRICS = {
  gdp_real_yoy: 'gdp_real_yoy.json',
  pce_core: 'pce_core.json',
  bbk_monthly_gdp: 'bbk_monthly_gdp.json',
};

const dataCache = {};

function processSeries(series, isRate = false) {
  const withYoY = series.map((point, i) => {
    if (point.value === '.') return { ...point, yoy: null };
    if (isRate) return { ...point, yoy: point.value };
    if (i >= 12) {
      const prevYearValue = series[i - 12].value;
      if (prevYearValue !== '.' && prevYearValue !== 0) {
        const yoy = ((point.value - prevYearValue) / prevYearValue) * 100;
        return { ...point, yoy };
      }
    }
    return { ...point, yoy: null };
  });

  return withYoY.map((point, i) => {
    if (i < 120 || point.yoy === null) return { ...point, rolling_avg_10y: null };
    const window = withYoY.slice(i - 120, i).map(p => p.yoy).filter(v => v !== null);
    if (window.length < 120) return { ...point, rolling_avg_10y: null };
    const sum = window.reduce((acc, v) => acc + v, 0);
    return { ...point, rolling_avg_10y: sum / 120 };
  });
}

function alignData(gdpSeries, inflationSeries) {
  // Heuristic to check if GDP is quarterly: quarterly series is much shorter than monthly
  const isGdpQuarterly = gdpSeries.length < inflationSeries.length / 2;

  return inflationSeries.map(inflationPoint => {
    let gdpPoint;
    if (isGdpQuarterly) {
      const inflationDate = new Date(inflationPoint.date);
      gdpPoint = gdpSeries.find(gdp => {
        const gdpDate = new Date(gdp.date);
        return gdpDate.getFullYear() === inflationDate.getFullYear() && Math.floor(gdpDate.getMonth() / 3) === Math.floor(inflationDate.getMonth() / 3);
      });
    } else {
      // If GDP is monthly, align by exact date
      gdpPoint = gdpSeries.find(gdp => gdp.date === inflationPoint.date);
    }

    if (gdpPoint && gdpPoint.yoy !== null && inflationPoint.yoy !== null) {
      return { 
        date: inflationPoint.date, 
        x: inflationPoint.yoy, 
        y: gdpPoint.yoy, 
        origin: { 
          x: inflationPoint.rolling_avg_10y, 
          y: gdpPoint.rolling_avg_10y
        } 
      };
    }
    return null;
  }).filter(p => p !== null);
}

async function loadAllData() {
  console.log('Loading and processing data for multiple frequencies...');
  try {
    const rawData = {};
    for (const key in METRICS) {
      const filePath = path.join(DATA_DIR, METRICS[key]);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      rawData[key] = JSON.parse(fileContent).observations.map(obs => ({ date: obs.date, value: parseFloat(obs.value) }));
    }

    const quarterlyGdpData = processSeries(rawData.gdp_real_yoy, true);
    const monthlyGdpData = processSeries(rawData.bbk_monthly_gdp, true); // Corrected: BBK is already a YoY rate
    const inflationData = processSeries(rawData.pce_core, false);

    dataCache['quarterly'] = alignData(quarterlyGdpData, inflationData);
    dataCache['monthly'] = alignData(monthlyGdpData, inflationData);

    console.log('Finished data processing. Cache is ready for all frequencies.');
  } catch (error) {
    console.error('Error loading or processing data:', error);
    process.exit(1);
  }
}

function getTimeseries(frequency = 'quarterly') {
  return dataCache[frequency] || [];
}

module.exports = { loadAllData, getTimeseries };
