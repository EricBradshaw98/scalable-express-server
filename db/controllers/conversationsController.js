const pool = require('../config/db');
const camelCaseKeys = require('../../utilities/camelCase');
const { addToBlacklist} = require('../../utilities/blacklist')
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utilities/jwttoken');






exports.getAllConversations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conversations');
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching conversations' });
  }
};


exports.getAllConversationsForUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        c.id AS conversation_id,
        c.name AS conversation_name,
        c.created_at AS conversation_created_at,
        c.updated_at AS conversation_updated_at,
        m.id AS message_id,
        m.content AS message_content,
        m.user_id AS message_user_id,
        m.created_at AS message_created_at,
        m.updated_at AS message_updated_at
      FROM
        conversations c
      JOIN
        user_conversations uc ON c.id = uc.conversation_id
      LEFT JOIN
        messages m ON c.id = m.conversation_id
      WHERE
        uc.user_id = $1
      ORDER BY
        c.created_at, m.created_at
    `, [id]);

    const conversations = {};
    result.rows.forEach(row => {
      const {
        conversation_id,
        conversation_name,
        conversation_created_at,
        conversation_updated_at,
        message_id,
        message_content,
        message_user_id,
        message_created_at,
        message_updated_at
      } = row;

      if (!conversations[conversation_id]) {
        conversations[conversation_id] = {
          id: conversation_id,
          name: conversation_name,
          createdAt: conversation_created_at,
          updatedAt: conversation_updated_at,
          messages: []
        };
      }

      if (message_id) {
        conversations[conversation_id].messages.push({
          id: message_id,
          content: message_content,
          userId: message_user_id,
          createdAt: message_created_at,
          updatedAt: message_updated_at
        });
      }
    });

    const camelCasedResult = Object.values(conversations).map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching conversations' });
  }
};

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM conversations WHERE id = $1', [id] );
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching conversations' });
  }
};





exports.createConversation = async (req, res) => {
  const { name, userId, recipientId } = req.body;

  try {
    
    await pool.query('BEGIN');

    
    const conversationResult = await pool.query(
      'INSERT INTO conversations (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    const conversationId = conversationResult.rows[0].id;

    
    await pool.query(
      'INSERT INTO user_conversations (user_id, conversation_id) VALUES ($1, $2)',
      [userId, conversationId]
    );

    
    await pool.query(
      'INSERT INTO user_conversations (user_id, conversation_id) VALUES ($1, $2)',
      [recipientId, conversationId]
    );

    
    await pool.query('COMMIT');

    const camelCasedResult = camelCaseKeys(conversationResult.rows[0]);
    res.status(201).json({ message: 'Conversation successfully created', data: camelCasedResult });
  } catch (error) {
    
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while creating the conversation' });
  }
};

// Update a user
exports.updateConversation = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    
    await pool.query('BEGIN');

  
    const result = await pool.query(
      'UPDATE conversations SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );

    
    await pool.query('COMMIT');

    if (result.rowCount > 0) {
      const camelCasedResult = camelCaseKeys(result.rows[0]);
      res.status(200).json({ message: 'Conversation successfully updated', data: camelCasedResult });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while updating the conversation' });
  }
};

// Delete a user
exports.deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    
    await pool.query('BEGIN');

    
    await pool.query(
      'DELETE FROM messages WHERE conversation_id = $1',
      [id]
    );

    await pool.query(
      'DELETE FROM user_conversations WHERE conversation_id = $1',
      [id]
    );

   
    const result = await pool.query(
      'DELETE FROM conversations WHERE id = $1 RETURNING *',
      [id]
    );

    
    await pool.query('COMMIT');

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Conversation successfully deleted' });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while deleting the conversation' });
  }
};