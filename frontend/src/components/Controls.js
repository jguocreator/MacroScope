import React from 'react';

const Controls = ({ 
  startDate, setStartDate,
  endDate, setEndDate,
  onPlay, isPlaying,
  onReset,
  animationSpeed, setAnimationSpeed,
  frequency, setFrequency
}) => {
  return (
    <div className="row g-3 align-items-center mb-3">
      {/* Frequency Selector */}
      <div className="col-auto">
        <label htmlFor="frequency-selector" className="col-form-label">Frequency:</label>
      </div>
      <div className="col-auto">
        <select id="frequency-selector" className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="quarterly">Quarterly (Real GDP)</option>
          <option value="monthly">Monthly (BBK GDP Proxy)</option>
        </select>
      </div>

      {/* Static Metric Display */}
      <div className="col-auto">
        <span className="form-text">Inflation: Core PCE (YoY)</span>
      </div>

      {/* Date Selectors */}
      <div className="col-auto">
        <label htmlFor="start-date" className="col-form-label">Start:</label>
      </div>
      <div className="col-auto">
        <input type="date" id="start-date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="col-auto">
        <label htmlFor="end-date" className="col-form-label">End:</label>
      </div>
      <div className="col-auto">
        <input type="date" id="end-date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Animation Controls */}
      <div className="col-auto ms-auto">
        <button className="btn btn-primary me-2" onClick={onPlay} disabled={!startDate || !endDate}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="col-auto">
        <label htmlFor="speed-slider" className="form-label">Speed</label>
        <input type="range" className="form-range" min="50" max="1000" step="50" id="speed-slider" value={animationSpeed} onChange={e => setAnimationSpeed(e.target.value)} />
      </div>
    </div>
  );
};

export default Controls;
