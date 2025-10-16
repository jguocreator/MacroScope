require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_KEY = process.env.FRED_API_KEY;
const DATA_DIR = path.join(__dirname, '../data');

const seriesToFetch = [
  { id: 'A191RL1Q225SBEA', file: 'gdp_real_yoy.json' }, // Quarterly Real GDP (YoY)
  { id: 'PCEPILFE', file: 'pce_core.json' },             // Core PCE Index
  { id: 'BBKMGDP', file: 'bbk_monthly_gdp.json' },      // Monthly GDP Proxy
];

async function fetchSeriesData(seriesId) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for series ${seriesId}:`, error.message);
    throw error;
  }
}

async function main() {
  if (!API_KEY) {
    console.error('Error: FRED_API_KEY not found in .env file.');
    process.exit(1);
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('Fetching data from FRED API...');

    for (const series of seriesToFetch) {
      console.log(`Fetching ${series.id}...`);
      const data = await fetchSeriesData(series.id);
      const filePath = path.join(DATA_DIR, series.file);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`Successfully saved ${series.file}`);
    }

    console.log('\nAll data fetched successfully.');
  } catch (error) {
    console.error('\nFailed to fetch and save data.');
    process.exit(1);
  }
}

main();
