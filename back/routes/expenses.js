const express = require('express');
const router = express.Router();
const { getExpensesByCategory, getAverageBasketByCategory, exportData } = require('../controllers/expenses');

router.get('/category/:sp_category', getExpensesByCategory);
router.get('/average/:sp_category', getAverageBasketByCategory);
router.get('/export/:row_count', exportData);

module.exports = router;