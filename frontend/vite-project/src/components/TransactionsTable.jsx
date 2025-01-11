import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionsTable.css';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/transactions/list`, {
        params: { month: selectedMonth, search, page, perPage },
      })
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, [selectedMonth, search, page, perPage]);

  const handleSearch = () => {
    setIsSearchVisible(true); // Show the search input field
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when a new search is initiated
  };

  return (
    <section className="transactions-dashboard">
      <h2 className="dashboard-title"></h2>

      <div className="filters-container">
        {/* Search Transaction */}
        <button className="search-transaction" onClick={handleSearch}>
          Search transaction
        </button>
        {isSearchVisible && (
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search by title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">
              Search
            </button>
          </form>
        )}

        {/* Select Month Dropdown */}
        <div className="select-month">
          <button className="select-month-button">
            {`Month: ${selectedMonth}`}
          </button>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
          {transactions.map((transaction) => {
  console.log(transaction.image); // Debug image URL
  return (
    <tr key={transaction._id}>
      <td>{transaction._id}</td>
      <td>{transaction.title}</td>
      <td>{transaction.description}</td>
      <td>${transaction.price}</td>
      <td>{transaction.category}</td>
      <td>{transaction.isSold ? 'Yes' : 'No'}</td>
      <td>
        <img
          src={transaction.image}
          alt="transaction"
          className="transaction-image"
          onError={(e) => (e.target.src = '/path/to/placeholder.png')} // Fallback if the image fails to load
        />
      </td>
    </tr>
  );
})}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <span>Page No: {page}</span>
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={transactions.length < perPage}
        >
          Next
        </button>
        <span>Per Page: {perPage}</span>
      </div>
    </section>
  );
};

export default TransactionsTable;
