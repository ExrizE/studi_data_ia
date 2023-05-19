const db = require('../db/db');
const { Parser } = require('json2csv');

const getExpensesByCategory = async (req, res) => {
    const spCategory = req.params.sp_category;

    try {
        const expenses = await db.any(`
            SELECT * 
            FROM Collecte
            WHERE sp_category = $1
        `, spCategory);

        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAverageBasketByCategory = async (req, res) => {
    const spCategory = req.params.sp_category;

    try {
        const averageBasket = await db.one(`
            SELECT AVG(total_basket) 
            FROM Client
            WHERE sp_category = $1
        `, spCategory);

        res.json(averageBasket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const exportData = async (req, res) => {
    const rowCount = req.params.row_count;

    try {
        const data = await db.any(`
            SELECT * 
            FROM Collecte
            LIMIT $1
        `, rowCount);

        const json2csv = new Parser();
        const csv = json2csv.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('data.csv');
        return res.send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getExpensesByCategory, getAverageBasketByCategory, exportData };