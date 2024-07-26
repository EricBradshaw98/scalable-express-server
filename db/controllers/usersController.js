const pool = require('../config/db');
const camelCaseKeys = require('../../utilities/camelCase');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, address, phoneNumber, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, password, address, phoneNumber, role]
    );
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.status(201).json({ message: 'User successfully Created',data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, address, phoneNumber, role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, address = $4, phone_number = $5, role = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, email, password, address, phoneNumber, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.json({ message: 'User successfully updated', data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User successfully deleted', data: camelCaseKeys(result.rows[0]) })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};
