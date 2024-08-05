const pool = require('../config/db');
const camelCaseKeys = require('../../utilities/camelCase');
const { addToBlacklist} = require('../../utilities/blacklist')
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utilities/jwttoken');


exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching posts' });
  }
};

// Get a single Post by ID
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the Post' });
  }
};

// Create a new Post
exports.createPost = async (req, res) => {
  const { name, content, image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (name, content, image) VALUES ($1, $2, $3) RETURNING *',
      [name, content, image]
    );
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.status(201).json({ message: 'Post successfully Created',data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the Post' });
  }
};

// Update a Post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { name, content, image } = req.body;
  try {
    const result = await pool.query(
      'UPDATE posts SET name = $1, content = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, content, image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.json({ message: 'Post successfully updated', data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the Post' });
  }
};

// Delete a Post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post successfully deleted', data: camelCaseKeys(result.rows[0]) })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the Post' });
  }
};