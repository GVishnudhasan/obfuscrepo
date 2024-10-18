import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

export const PieChartJS = ({ chartData, title }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: true,
            },
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 18,
                family: 'Arial, sans-serif',
                weight: 'bold',
              },
              color: '#6A1B9A',
              padding: {
                top: 10,
                bottom: 20,
              },
            },
          },
        }}
      />
    </div>
  );
};
