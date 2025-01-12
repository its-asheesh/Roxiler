import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';

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
    <div className="statistics-container">
      <h1 className="statistics-title">
        Statistics - {selectedMonth} <span className="month-text">(Selected month name from dropdown)</span>
      </h1>

      {loading && <div className="loading">Loading...</div>}

      {error && !loading && <div className="error">{error}</div>}

      {statistics && !loading && !error && (
        <div className="statistics-card">
          <div className="stat-row">
            <span>Total Sale</span>
            <span>{statistics.totalSaleAmount}</span>
          </div>
          <div className="stat-row">
            <span>Total Sold Item</span>
            <span>{statistics.totalSoldItems}</span>
          </div>
          <div className="stat-row">
            <span>Total Not Sold Item</span>
            <span>{statistics.totalNotSoldItems}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
