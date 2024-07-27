const pool = require('../config/db');
const upload = require('../config/multerConfig');
const camelCaseKeys = require('../../utilities/camelCase');
const { addToBlacklist} = require('../../utilities/blacklist')
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utilities/jwttoken');
const path = require('path');
const fs = require('fs');
const format = require('pg-format')










exports.getAllDocuments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const camelCasedResult = result.rows.map(camelCaseKeys);
    res.json({ data: camelCasedResult });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Get a single user by ID
exports.getDocumentsById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM user_files WHERE user_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No documents found for this user' });
    }

    const documents = result.rows.map(doc => camelCaseKeys(doc));

    res.json({
      message: 'Documents retrieved successfully',
      documents: documents,
    });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the documents' });
  }
};



exports.uploadSingleFile = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const fileData = {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      userId: userId,
    };

    const result = await pool.query(
      'INSERT INTO user_files (filename, path, mimetype, size, user_id, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fileData.filename, fileData.path, fileData.mimetype, fileData.size, fileData.userId, fileData.filename]
    );

    const camelCasedResult = camelCaseKeys(result.rows[0]);
    res.status(201).json({ message: 'File uploaded successfully', data: result.rows });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
};


exports.uploadMultipleFiles = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const filesData = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      userId: userId,
    }));

    const values = filesData.map(file => [file.filename, file.path, file.mimetype, file.size, file.userId, file.filename]);

    
    const query = format('INSERT INTO user_files (filename, path, mimetype, size, user_id, name) VALUES %L RETURNING *', values);

    const result = await pool.query(query);

    res.json({
      message: 'Files uploaded successfully',
      files: result.rows,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'An error occurred while uploading the files' });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM user_files WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];
    const filePath = path.join(file.path);

    
    console.log('Deleting file from:', filePath);

    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
      }
    });

    await pool.query('DELETE FROM user_files WHERE id = $1', [id]);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'An error occurred while deleting the file' });
  }
};

exports.renameFile = async (req, res) => {
  const { id } = req.params;
  const { newFilename } = req.body;

  try {
    const result = await pool.query('SELECT * FROM user_files WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];
    const fileExtension = path.extname(file.filename);

    // Update only the name in the database
    const updatedFileData = await pool.query(
      'UPDATE user_files SET name = $1 WHERE id = $2 RETURNING *',
      [newFilename + fileExtension, id]
    );

    res.json({
      message: 'File renamed successfully',
      file: updatedFileData.rows[0],
    });
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ error: 'An error occurred while renaming the file' });
  }
};

exports.downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM user_files WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];
    const filePath = path.join(file.path);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist:', err);
        return res.status(404).json({ error: 'File not found' });
      }

      // Send the file as a response
      res.download(filePath, file.filename, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'An error occurred while sending the file' });
        }
      });
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the file' });
  }
};