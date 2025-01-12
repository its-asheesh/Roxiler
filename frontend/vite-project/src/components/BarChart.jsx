import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { CircularProgress, Box, Typography } from '@mui/material';

const BarChart = ({ selectedMonth, selectedYear }) => {
  const [barChartData, setBarChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions/barChart', {
          params: { month: selectedMonth, year: selectedYear },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          const labels = res.data.map(item => item._id);
          const counts = res.data.map(item => item.count);

          const chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Items Sold in Price Range',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          };

          setBarChartData(chartData);
        } else {
          setError('No data available for the selected month and year');
        }
      } catch (err) {
        console.error('Error fetching bar chart data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedMonth, selectedYear]);

  return (
    <Box sx={{ padding: 3, maxWidth: '900px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
        Bar Chart: Items Sold by Price Range
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {barChartData && !loading && !error && (
        <Box sx={{ marginTop: 3 }}>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `Price Range: ${tooltipItem.label}, Count: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Price Range',
                  },
                  ticks: {
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 30,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Items Sold',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BarChart;
