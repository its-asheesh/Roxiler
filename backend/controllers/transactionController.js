const axios = require('axios');
const Transaction = require('../models/Transaction');
const moment = require('moment'); // Optional but helpful for date management

// Helper: Get start and end dates for a month
const getMonthRange = (month, year = 2022) => {
  const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
  const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();
  
  console.log('Start of Month:', startOfMonth); // Log to verify
  console.log('End of Month:', endOfMonth); // Log to verify

  return { startOfMonth, endOfMonth };
};


// Fetch and seed data
const fetchAndSeedData = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

    const transactions = data.map(item => ({
      title: item.title || 'Untitled',
      description: item.description || 'No description',
      price: item.price || 0,
      dateOfSale: item.dateOfSale ? new Date(item.dateOfSale) : new Date(),
      isSold: item.isSold ?? false,
      category: item.category || 'Uncategorized',
    }));

    await Transaction.deleteMany(); // Clear old data
    await Transaction.insertMany(transactions); // Seed new data

    res.status(200).json({ message: 'Database seeded successfully', count: transactions.length });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding database', details: error.message });
  }
};

// List transactions
const listTransactions = async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  const { startOfMonth, endOfMonth } = getMonthRange(month);

  const query = {
    dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
  };

  if (search) {
    const regex = new RegExp(search, 'i'); // For string fields
    const parsedPrice = parseFloat(search); // Attempt to parse numeric value

    query.$or = [
      { title: regex },
      { description: regex },
      ...(isNaN(parsedPrice) ? [] : [{ price: parsedPrice }]), // Only include price if search is a number
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions', details: error.message });
  }
};



// Get statistics
const getStatistics = async (req, res) => {
  const { month, year = 2022 } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  const { startOfMonth, endOfMonth } = getMonthRange(month, year);

  try {
    const stats = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $facet: {
          totalSaleAmount: [
            {
              $group: {
                _id: null,
                total: { $sum: '$price' },
              },
            },
          ],
          soldItems: [
            {
              $match: { isSold: true },
            },
            {
              $count: 'count',
            },
          ],
          notSoldItems: [
            {
              $match: { isSold: false },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const totalSaleAmount = stats[0].totalSaleAmount.length ? stats[0].totalSaleAmount[0].total : 0;
    const totalSoldItems = stats[0].soldItems.length ? stats[0].soldItems[0].count : 0;
    const totalNotSoldItems = stats[0].notSoldItems.length ? stats[0].notSoldItems[0].count : 0;

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching statistics', details: error.message });
  }
};




// Get bar chart
const getBarChart = async (req, res) => {
  const { month, year = 2022 } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  const { startOfMonth, endOfMonth } = getMonthRange(month, year);

  try {
    const barChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: 'Others',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.status(200).json(barChart);
  } catch (error) {
    res.status(500).json({ error: 'Error generating bar chart', details: error.message });
  }
};

// Get pie chart
const getPieChart = async (req, res) => {
  const { month, year = 2022 } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  const { startOfMonth, endOfMonth } = getMonthRange(month, year);

  try {
    const categories = await Transaction.aggregate([
      { 
        $match: { 
          dateOfSale: { 
            $gte: startOfMonth, 
            $lte: endOfMonth 
          }
        }
      },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 } 
        }
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error generating pie chart', details: error.message });
  }
};

// Get combined data
const getCombinedData = async (req, res) => {
  const { month, year = 2022 } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid or missing month parameter' });
  }

  const { startOfMonth, endOfMonth } = getMonthRange(month, year);

  try {
    const statistics = await getStatistics({ query: { month, year } });
    const barChart = await getBarChart({ query: { month, year } });
    const pieChart = await getPieChart({ query: { month, year } });

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: 'Error generating combined data', details: error.message });
  }
};

module.exports = {
  fetchAndSeedData,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};
