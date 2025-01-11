// src/App.jsx
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('03');

  return (
    <div className="app">
      <header>
        <h1>Transactions Dashboard</h1>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={(i + 1).toString().padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </header>
      <main>
        <Statistics selectedMonth={selectedMonth} />
        <TransactionsTable selectedMonth={selectedMonth} />
        <BarChart selectedMonth={selectedMonth} />
        <PieChart selectedMonth={selectedMonth} />
      </main>
    </div>
  );
};

export default App;
