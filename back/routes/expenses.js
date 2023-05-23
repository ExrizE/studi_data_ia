const express = require('express');
const router = express.Router();
const { getExpensesByCategory, getAverageBasketByCategory, exportData, getDates } = require('../controllers/expenses');

router.get('/category/:date', getExpensesByCategory);
router.get('/average', getAverageBasketByCategory);
router.get('/export/:row_count', exportData);
router.get('/dates', getDates);

module.exports = router;