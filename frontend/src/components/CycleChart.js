import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin);

const CycleChart = ({ seriesData }) => {

  if (!seriesData) {

    return null;

  }



  const quadrantPlugin = {

    id: 'quadrant',

    beforeDraw(chart, args, options) {

      const { ctx, chartArea: { top, right, bottom, left }, scales: { x, y } } = chart;

      ctx.save();

  

      const xOrigin = x.getPixelForValue(seriesData.origin.x);

      const yOrigin = y.getPixelForValue(seriesData.origin.y);

  

          // Quadrant lines

  

          ctx.strokeStyle = 'rgba(255, 99, 132, 0.8)'; // A salient red color

  

          ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.moveTo(xOrigin, top);

      ctx.lineTo(xOrigin, bottom);

      ctx.moveTo(left, yOrigin);

      ctx.lineTo(right, yOrigin);

      ctx.stroke();

  

      // Quadrant labels

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

      ctx.font = 'bold 14px Arial';

      ctx.textAlign = 'center';

      ctx.textBaseline = 'middle';

  

      // Top-Right: Reflation

      ctx.fillText('Reflation', xOrigin + (right - xOrigin) * 0.5, yOrigin - (yOrigin - top) * 0.5);

      // Top-Left: Expansion

      ctx.fillText('Expansion', xOrigin - (xOrigin - left) * 0.5, yOrigin - (yOrigin - top) * 0.5);

      // Bottom-Left: Recession

      ctx.fillText('Recession', xOrigin - (xOrigin - left) * 0.5, yOrigin + (bottom - yOrigin) * 0.5);

      // Bottom-Right: Stagflation

      ctx.fillText('Stagflation', xOrigin + (right - xOrigin) * 0.5, yOrigin + (bottom - yOrigin) * 0.5);

  

          ctx.restore();

  

        }

  

      };



  const lastPoint = seriesData.series.length > 0 ? seriesData.series[seriesData.series.length - 1] : null;



  const data = {

    datasets: [

      {

        label: `${seriesData.yLabel} vs ${seriesData.xLabel}`,

        data: seriesData.series.map(p => ({ x: p.x, y: p.y })),

        borderColor: 'rgba(75, 192, 192, 1)',

        backgroundColor: 'rgba(75, 192, 192, 0.2)',

        showLine: true, // Connect the dots

      },

      {

        label: 'Most Recent',

        data: lastPoint ? [{ x: lastPoint.x, y: lastPoint.y }] : [],

        backgroundColor: 'rgba(255, 99, 132, 1)',

                        pointRadius: 6,

                      }

                    ],

                  };



    const options = {



      scales: {



        x: {



          title: {



            display: true,



            text: seriesData.xLabel,



          },



        },



        y: {



          title: {



            display: true,



            text: seriesData.yLabel,



          },



        },



      },



      plugins: {



        zoom: {



          pan: {



            enabled: true,



            mode: 'xy',



          },



          zoom: {



            wheel: {



              enabled: true,



            },



            pinch: {



              enabled: true



            },



            mode: 'xy',



          }



        },



        tooltip: {

        callbacks: {

                    label: function(context) {

                      let point;

                      if (context.datasetIndex === 1) { // 'Most Recent' dataset

                        point = seriesData.series[seriesData.series.length - 1];

                      } else {

                        point = seriesData.series[context.dataIndex];

                      }

                      if (!point) return '';

                      return `Date: ${point.date}`;

                    },

                    afterLabel: function(context) {

                      let point;

                      if (context.datasetIndex === 1) { // 'Most Recent' dataset

                        point = seriesData.series[seriesData.series.length - 1];

                      } else {

                        point = seriesData.series[context.dataIndex];

                      }

                      if (!point) return '';

                      return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;

                    }

        }

      }

    }

  };

  return <Scatter data={data} options={options} plugins={[quadrantPlugin]} />;
};

export default CycleChart;
