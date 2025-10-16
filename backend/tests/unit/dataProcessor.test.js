const { calculateGrowthRates } = require('../../src/dataProcessor');

describe('dataProcessor', () => {
  describe('calculateGrowthRates', () => {
    it('should correctly calculate YoY and 10-year rolling average', () => {
      // Create a dummy series of 132 months (11 years)
      const series = Array.from({ length: 132 }, (_, i) => ({
        date: `2000-${(i % 12) + 1}-01`,
        value: 100 + i, // Simple linear growth
      }));

      const result = calculateGrowthRates(series);

      // Test a point after 1 year but before 10 years
      const point13 = result[13];
      expect(point13.yoy).toBeCloseTo(((113 - 101) / 101) * 100);
      expect(point13.rolling_avg_10y).toBeNull();

      // Test a point after 10 years
      const point121 = result[121];
      expect(point121.yoy).toBeCloseTo(((221 - 209) / 209) * 100);
      expect(point121.rolling_avg_10y).not.toBeNull();

      // A simple check on the rolling average calculation
      // A more robust test would mock the data and calculate the exact expected average
      let sum = 0;
      for (let i = 1; i <= 120; i++) {
        const yoy = ((100 + (121 - i)) - (100 + (121 - i - 12))) / (100 + (121 - i - 12)) * 100;
        sum += yoy;
      }
      const expected_avg = sum / 120;
      expect(result[121].rolling_avg_10y).toBeCloseTo(expected_avg);
    });
  });
});
