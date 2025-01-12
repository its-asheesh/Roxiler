import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { CircularProgress, Box, Typography } from '@mui/material';

const PieChart = ({ selectedMonth }) => {
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transactions/piechart`, {
          params: { month: selectedMonth },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          const labels = res.data.map(item => item._id);
          const counts = res.data.map(item => item.count);

          const chartData = {
            labels: labels, 
            datasets: [
              {
                label: 'Category Distribution',
                data: counts, 
                backgroundColor: getRandomColors(labels.length),
                borderColor: getRandomColors(labels.length, true),
                borderWidth: 1,
              },
            ],
          };

          setPieChartData(chartData);
        } else {
          setError('No data available for the selected month');
        }
      } catch (err) {
        console.error('Error fetching pie chart data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const getRandomColors = (count, border = false) => {
    const colors = [];
    const colorList = [
      'rgba(75, 192, 192, 0.2)', // Light Green
      'rgba(255, 159, 64, 0.2)', // Orange
      'rgba(153, 102, 255, 0.2)', // Purple
      'rgba(54, 162, 235, 0.2)', // Blue
      'rgba(255, 99, 132, 0.2)', // Red
      'rgba(255, 206, 86, 0.2)', // Yellow
    ];

    for (let i = 0; i < count; i++) {
      const color = colorList[i % colorList.length];
      colors.push(border ? color.replace('0.2', '1') : color);
    }
    return colors;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Pie Chart - Category Distribution
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {pieChartData && !loading && !error && (
        <Box sx={{ width: '80%', maxWidth: 600, height: 400 }}>
          <Pie data={pieChartData} />
        </Box>
      )}
    </Box>
  );
};

export default PieChart;
