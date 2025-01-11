import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionsTable.css'; // Assuming you'll create a CSS file for styling

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/transactions/list`, {
        params: { month: selectedMonth, search, page, perPage: 10 },
      })
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, [selectedMonth, search, page]);

  return (
    <section className="transactions-table-container">
      <h2 className="title">Transactions</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>${transaction.price}</td>
                <td>{transaction.dateOfSale}</td>
                <td>{transaction.isSold ? 'Sold' : 'Not Sold'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default TransactionsTable;
