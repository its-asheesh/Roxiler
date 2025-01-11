// routes/transactionRoutes.js
const express = require('express');
const {
  fetchAndSeedData,
  listTransactions,
  getStatistics,
  getBarChart,  // This is the route you're hitting for the bar chart
  getPieChart,
  getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

// Define routes
router.get('/seed', fetchAndSeedData);
router.get('/list', listTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);  // Ensure this is correctly mapped
router.get('/piechart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
