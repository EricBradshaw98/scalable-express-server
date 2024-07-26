const { Pool } = require('pg');
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST


const pool = new Pool({
  user: dbUser,
  password: dbPass,
  host: dbHost,
  port: 5432, // default Postgres port
  database: dbName
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};