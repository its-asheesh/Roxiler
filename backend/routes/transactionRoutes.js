// routes/transactionRoutes.js
const express = require('express');
const {
  fetchAndSeedData,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

//routes
router.get('/seed', fetchAndSeedData);
router.get('/list', listTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
