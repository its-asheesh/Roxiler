import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month, year }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5000/api/transactions/statistics`, {
        params: { month, year }
      })
      .then((response) => {
        setStatistics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load statistics');
        setLoading(false);
      });
  }, [month, year]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Statistics for {month}/{year}</h3>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
