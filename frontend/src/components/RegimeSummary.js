import React from 'react';

const RegimeSummary = ({ seriesData }) => {
  if (!seriesData || !seriesData.series || seriesData.series.length === 0) {
    return null;
  }

  const lastPoint = seriesData.series[seriesData.series.length - 1];
  const origin = seriesData.origin;

  let regime = '';
  if (lastPoint.y >= origin.y && lastPoint.x < origin.x) {
    regime = 'Expansion';
  } else if (lastPoint.y >= origin.y && lastPoint.x >= origin.x) {
    regime = 'Reflation';
  } else if (lastPoint.y < origin.y && lastPoint.x >= origin.x) {
    regime = 'Stagflation';
  } else {
    regime = 'Recession';
  }

  return (
    <div className="mt-4 p-3 border rounded bg-light">
      <h4 className="mb-3">Current Economic Regime</h4>
      <h5>{regime}</h5>
    </div>
  );
};

export default RegimeSummary;
