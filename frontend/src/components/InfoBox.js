import React from 'react';

const InfoBox = ({ origin }) => {
  if (!origin) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border rounded bg-light">
      <h4 className="mb-3">How is the Center Point Calculated?</h4>
      <p>
        The center of the chart is dynamic and represents the long-term "normal" for the economy. It is calculated using the 
        <strong>10-year (120-month) rolling average</strong> of the Year-over-Year (YoY) growth rates for both the inflation and GDP metrics.
      </p>
      <p>
        This method avoids using a fixed zero point and adapts to different economic eras, providing a more accurate picture of the current regime relative to its recent history.
      </p>
      <hr />
      <p className="mb-0">
        <strong>Current Center Point:</strong> 
        Inflation (X-axis): <strong>{origin.x ? origin.x.toFixed(2) : 'N/A'}%</strong>, 
        GDP Growth (Y-axis): <strong>{origin.y ? origin.y.toFixed(2) : 'N/A'}%</strong>
      </p>
    </div>
  );
};

export default InfoBox;
