require('dotenv').config();

const pgp = require('pg-promise')();

// Les informations d'authentification sont maintenant chargées à partir de votre fichier .env
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(connection);

module.exports = db;