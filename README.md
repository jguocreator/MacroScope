# MacroScope: A Dynamic Economic Cycle Dashboard

MacroScope is an interactive web application designed to visualize the U.S. economic cycle. It plots economic growth against inflation on a dynamic four-quadrant chart, allowing users to identify the current economic regime—Expansion, Reflation, Stagflation, or Recession—and observe its historical path.

This project serves as a portfolio piece demonstrating skills in full-stack development, data processing, and creating insightful data visualizations with a sophisticated economic methodology.

---

## Features

-   **Dynamic Four-Quadrant Chart**: Visualizes the economic cycle by plotting growth vs. inflation.
-   **Dynamic Origin Point**: The chart's center is not fixed at zero but is based on a 10-year rolling average, providing a more accurate, adaptive measure of the current economic regime.
-   **Frequency Selection**: Users can switch between quarterly Real GDP data and a monthly high-frequency GDP proxy (BBK Index) for more timely analysis.
-   **Animated Playback**: An animation feature allows users to watch the economy's path unfold over a selected time frame.
-   **Interactive Controls**: Includes a date range selector and animation controls (play, pause, reset, speed).
-   **Zoom & Pan**: The chart is fully interactive, allowing users to zoom in on specific periods and pan across the historical path.

## Methodology

### The Investment Clock Framework

The dashboard is based on the "Investment Clock" model, which classifies the economic cycle based on the vectors of growth and inflation. The four regimes are defined as:

-   **Expansion (Top-Left)**: High/Accelerating Growth, Low/Falling Inflation.
-   **Reflation (Top-Right)**: High/Accelerating Growth, High/Rising Inflation.
-   **Stagflation (Bottom-Right)**: Low/Decelerating Growth, High/Rising Inflation.
-   **Recession (Bottom-Left)**: Low/Decelerating Growth, Low/Falling Inflation.

### Dynamic Origin Calculation

To accurately classify the regime, the origin of the chart is not static. Instead, it is dynamically set based on the **10-year (120-month) rolling average** of the Year-over-Year (YoY) data for both the selected growth and inflation indicators. This method is economically robust as it adapts to different long-term economic eras and avoids arbitrary fixed thresholds.

-   **Growth Axis (Y-axis)**: A data point is considered "High Growth" if it is above its 10-year moving average.
-   **Inflation Axis (X-axis)**: A data point is considered "High Inflation" if it is above its 10-year moving average.

### Data Processing & Alignment

-   **YoY Calculations**: All inflation data is calculated from its respective index to get a Year-over-Year percentage change, providing a clear view of the underlying trend.
-   **Frequency Alignment**: To plot a cohesive monthly path, the application handles the frequency mismatch between monthly inflation data and quarterly GDP data by mapping the single quarterly GDP growth figure to each of the three corresponding months.

## Data Sources

This application uses data sourced from the Federal Reserve Economic Data (FRED) database. The following time series are used:

| Metric | Frequency | FRED Series ID |
| :--- | :--- | :--- |
| Real GDP (YoY) | Quarterly | `A191RL1Q225SBEA` |
| BBK Monthly GDP (YoY) | Monthly | `BBKMGDP` |
| Core PCE Price Index | Monthly | `PCEPILFE` |

---

## Quickstart

### Prerequisites

-   Node.js (v18 or higher)
-   npm (or a compatible package manager)
-   A valid FRED API key.

### Setup & Running

1.  **Install Dependencies**: From the project root, run `npm install`.
2.  **Configure Environment**: Create a `.env` file in the root of the project and add your FRED API key (`FRED_API_KEY=your_key_here`).
3.  **Fetch Data**: Run `node scripts/fetch-data.js` to download the necessary economic data.
4.  **Start Servers**: Run `npm run start:backend` and, in a separate terminal, `npm run start:frontend`.
5.  **View**: Open `http://localhost:3000` in your browser.