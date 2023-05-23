const db = require('../db/db');
const { Parser } = require('json2csv');

const getExpensesByCategory = async (req, res) => {
    const dateObject = req.params;
    const date = dateObject.date;
    try {
        const response = await db.query('SELECT client.sp_category, collecte.details FROM collecte INNER JOIN client ON collecte.client_id = client.id WHERE date(collecte.date) = $1', [date]);
        let result = {};
        if (response && response.length > 0) {
        response.forEach(row => {
            result[row.sp_category] = Object.values(row.details);
            });
        res.status(200).json(result);
        } else {
        res.status(404).json({ error: 'Aucune donnée n\'a été trouvée pour cette date.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
    }
};
const getAverageBasketByCategory = async (req, res) => {
  try {
      const order = ['Employé', 'Ouvrier', 'Profession intermédiaire', 'Indépendant', 'Cadre', 'Retraité', 'Sans activité'];
      const response = await db.query('SELECT client.sp_category, AVG(collecte.total_basket) AS average_basket FROM collecte INNER JOIN client ON collecte.client_id = client.id GROUP BY client.sp_category');
      
      let result = response.map(row => {
          let average_basket = parseFloat(row.average_basket);
          if (!isNaN(average_basket)) {
              average_basket = average_basket.toFixed(2);
          }
          return average_basket;
      });

      result.sort((a, b) => {
          let indexA = order.indexOf(a.sp_category);
          let indexB = order.indexOf(b.sp_category);
          if (indexA < indexB) {
              return -1;
          }
          if (indexA > indexB) {
              return 1;
          }
          return 0;
      });
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
  }
};

const getDates = async (req, res) => {
  try {
      const response = await db.query("SELECT DISTINCT TO_CHAR(date, 'YYYY-MM-DD') as date FROM collecte ORDER BY date ASC");

      const result = response.map(row => row.date);

      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des dates.' });
  }
};


const exportData = async (req, res) => {
    const rowCount = req.params.row_count;
    try {
        const response = await db.query('SELECT * FROM collecte LIMIT $1', [rowCount]);
        const json2csvParser = new Parser();
        const csv = await json2csvParser.parse(response);
        res.header('Content-Type', 'text/csv');
        res.attachment('collecte_data.csv');
        console.log(csv)
        return res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'exportation des données.' });
    }
};

module.exports = { getExpensesByCategory, getAverageBasketByCategory, exportData, getDates };