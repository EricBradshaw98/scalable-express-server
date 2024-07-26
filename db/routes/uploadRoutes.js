const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const pool = require('../config/db'); 
const format = require('pg-format');
const fs = require('fs');
const path = require('path');



// Single file upload
router.post('/upload-single', upload.single('file'), async (req, res) => {
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

    res.json({
      message: 'File uploaded successfully',
      file: result.rows[0],
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
});

// Multiple files upload
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
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
});



//delete file
router.delete('/delete/:id', async (req, res) => {
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
});


//rename file
router.put('/rename/:id', async (req, res) => {
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
});

module.exports = router;



