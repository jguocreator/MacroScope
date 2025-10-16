import React, { useState, useEffect } from 'react';
import './App.css';
import Controls from './components/Controls';
import CycleChart from './components/CycleChart';
import Legend from './components/Legend';
import RegimeSummary from './components/RegimeSummary';
import InfoBox from './components/InfoBox';

function App() {
  const [fullSeriesData, setFullSeriesData] = useState(null);
  const [displayedData, setDisplayedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('2010-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState('monthly');

  const [isPlaying, setIsPlaying] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ startDate, endDate, frequency });
        const response = await fetch(`http://localhost:3001/api/timeseries?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFullSeriesData(data);
        if (data.series && data.series.length > 0) {
          setDisplayedData({ ...data, series: [data.series[0]] });
        } else {
          setDisplayedData(null);
        }
        setAnimationIndex(0);
        setIsPlaying(false);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, frequency]);

  useEffect(() => {
    if (!isPlaying || !fullSeriesData || !fullSeriesData.series || fullSeriesData.series.length === 0) return;

    const interval = setInterval(() => {
      setAnimationIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= fullSeriesData.series.length) {
          setIsPlaying(false);
          return prevIndex;
        }
        setDisplayedData({ ...fullSeriesData, series: fullSeriesData.series.slice(0, nextIndex + 1) });
        return nextIndex;
      });
    }, 1050 - animationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, fullSeriesData, animationSpeed]);

  const handlePlay = () => {
    if (fullSeriesData && fullSeriesData.series.length > 0) {
      if (animationIndex >= fullSeriesData.series.length - 1) {
        setAnimationIndex(0);
        setDisplayedData({ ...fullSeriesData, series: [fullSeriesData.series[0]] });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationIndex(0);
    if (fullSeriesData && fullSeriesData.series.length > 0) {
      setDisplayedData({ ...fullSeriesData, series: [fullSeriesData.series[0]] });
    }
  };

  return (
    <div className="App">
      <header className="bg-dark text-white p-3 mb-4">
        <div className="container"><h1>MacroScope Cycle Dashboard</h1></div>
      </header>
      <main className="container">
        <RegimeSummary seriesData={fullSeriesData} />
        <hr className="my-4" />
        <Controls 
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          onPlay={handlePlay} isPlaying={isPlaying}
          onReset={handleReset}
          animationSpeed={animationSpeed} setAnimationSpeed={setAnimationSpeed}
          frequency={frequency} setFrequency={setFrequency}
        />
        <hr className="my-4" />
        {loading && <div className="d-flex justify-content-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
        {error && <div className="alert alert-danger">Error: {error}</div>}
        <CycleChart seriesData={displayedData} />
        <Legend />
        <InfoBox origin={fullSeriesData ? fullSeriesData.origin : null} />
      </main>
    </div>
  );
}

export default App;