import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';

const Statistics = ({ selectedMonth, selectedYear }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/transactions/statistics`, {
          params: { month: selectedMonth, year: selectedYear },
        });

        if (
          response.data &&
          typeof response.data.totalSaleAmount === 'number' &&
          typeof response.data.totalSoldItems === 'number' &&
          typeof response.data.totalNotSoldItems === 'number'
        ) {
          setStatistics(response.data);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(`Failed to load statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth, selectedYear]);

  return (
    <Box sx={{ padding: 3, maxWidth: '900px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
        Statistics for {selectedMonth}/{selectedYear}
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

      {statistics && !loading && !error && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">
            <strong>Total Sale Amount:</strong> ${statistics.totalSaleAmount.toFixed(2)}
          </Typography>
          <Typography variant="h6">
            <strong>Total Sold Items:</strong> {statistics.totalSoldItems}
          </Typography>
          <Typography variant="h6">
            <strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Statistics;
