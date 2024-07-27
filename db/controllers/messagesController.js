const pool = require('../config/db');
const camelCaseKeys = require('../../utilities/camelCase');
const { addToBlacklist} = require('../../utilities/blacklist')
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utilities/jwttoken');






exports.getAllMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching messages' });
  }
};

exports.getMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id] );
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching conversations' });
  }
};


exports.createMessage = async (req, res) => {
  const { content, userId, recipientId } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    let conversationId;

    // Check if a conversation exists between the given users
    const conversationResult = await pool.query(`
      SELECT c.id
      FROM conversations c
      JOIN user_conversations uc1 ON c.id = uc1.conversation_id AND uc1.user_id = $1
      JOIN user_conversations uc2 ON c.id = uc2.conversation_id AND uc2.user_id = $2
      WHERE c.id = uc1.conversation_id AND c.id = uc2.conversation_id
    `, [userId, recipientId]);

    if (conversationResult.rowCount > 0) {
      // Use the existing conversation ID
      conversationId = conversationResult.rows[0].id;
    } else {
      // Create a new conversation
      const newConversationResult = await pool.query(
        'INSERT INTO conversations (name, user_id) VALUES ($1, $2) RETURNING *',
        [`Conversation between ${userId} and ${recipientId}`, userId]
      );

      conversationId = newConversationResult.rows[0].id;

      // Insert the users into user_conversations
      await pool.query(
        'INSERT INTO user_conversations (user_id, conversation_id) VALUES ($1, $2), ($3, $4)',
        [userId, conversationId, recipientId, conversationId]
      );
    }

    // Create the message
    const messageResult = await pool.query(
      'INSERT INTO messages (content, conversation_id, user_id) VALUES ($1, $2, $3) RETURNING *',
      [content, conversationId, userId]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    const camelCasedMessage = camelCaseKeys(messageResult.rows[0]);
    res.status(201).json({ message: 'Message successfully created', data: camelCasedMessage });
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while creating the message' });
  }
};




// Delete a message
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Get the conversation ID of the message to be deleted
    const messageResult = await pool.query(
      'SELECT conversation_id FROM messages WHERE id = $1',
      [id]
    );

    if (messageResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Message not found' });
    }

    const conversationId = messageResult.rows[0].conversation_id;

    // Delete the message
    await pool.query(
      'DELETE FROM messages WHERE id = $1',
      [id]
    );

    // Check if there are any remaining messages in the conversation
    const remainingMessagesResult = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE conversation_id = $1',
      [conversationId]
    );

    const remainingMessagesCount = parseInt(remainingMessagesResult.rows[0].count, 10);

    if (remainingMessagesCount === 0) {
      // Delete user_conversations entries associated with the conversation
      await pool.query(
        'DELETE FROM user_conversations WHERE conversation_id = $1',
        [conversationId]
      );

      // Delete the conversation
      await pool.query(
        'DELETE FROM conversations WHERE id = $1',
        [conversationId]
      );
    }

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Message successfully deleted' });
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while deleting the message' });
  }
};

exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Update the message content
    const result = await pool.query(
      'UPDATE messages SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content, id]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    if (result.rowCount > 0) {
      const camelCasedResult = camelCaseKeys(result.rows[0]);
      res.status(200).json({ message: 'Message successfully updated', data: camelCasedResult });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'An error occurred while updating the message' });
  }
};
