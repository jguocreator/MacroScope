import React from 'react';

const Legend = () => {
  return (
    <div className="mt-4 p-3 border rounded">
      <h4 className="mb-3">Quadrant Legend</h4>
      <div className="row">
        <div className="col-md-6 mb-2">
          <strong>Reflation (Top-Right):</strong> Rising Growth, Rising Inflation
        </div>
        <div className="col-md-6 mb-2">
          <strong>Expansion (Top-Left):</strong> Rising Growth, Falling/Stable Inflation
        </div>
        <div className="col-md-6 mb-2">
          <strong>Stagflation (Bottom-Right):</strong> Falling Growth, Rising Inflation
        </div>
        <div className="col-md-6 mb-2">
          <strong>Recession (Bottom-Left):</strong> Falling Growth, Falling/Stable Inflation
        </div>
      </div>
    </div>
  );
};

export default Legend;
