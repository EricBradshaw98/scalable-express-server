const pool = require('../db/config/db');

const addToBlacklist = async (token) => {
  await pool.query('INSERT INTO blacklisted_tokens (token) VALUES ($1)', [token]);
  console.log(`Token added to blacklist: ${token}`);
};

const isBlacklisted = async (token) => {
  const result = await pool.query('SELECT 1 FROM blacklisted_tokens WHERE token = $1', [token]);
  const isBlacklisted = result.rowCount > 0;
  console.log(`Token ${token} is blacklisted: ${isBlacklisted}`);
  return isBlacklisted;
};

module.exports = { addToBlacklist, isBlacklisted };
