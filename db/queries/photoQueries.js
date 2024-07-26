const { query } = require("../db");

async function getPhotoByEmail(email) {
  try {
    const getPhotoQuery = `
      SELECT l.*, u.* 
      FROM photos l
      INNER JOIN users u ON l.user_id = u.id
      WHERE u.email = $1`;
    const result = await query(getPhotoQuery, [email]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving photo by email: ${error.message}`);
  }
}


async function getPhotoById(id) {
  try {
    const getPhotoQuery = 'SELECT * FROM photos WHERE id = $1';
    const result = await query(getPhotoQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving photo by ID: ${error.message}`);
  }
}

async function insertPhoto(name, user_id, url) {
  try {
    const insertPhotoQuery = `
      INSERT INTO listings (name, user_id, url, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *`;
      
    const result = await query(insertPhotoQuery, [name, user_id, url]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error inserting photo: ${error.message}`);
  }
}

async function removePhoto(id) {
  try {
    const deletePhotoQuery = 'DELETE FROM photos WHERE id = $1 RETURNING *';
    const result = await query(deletePhotoQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error deleting photo by ID: ${error.message}`);
  }
}


module.exports = {
  getPhotoByEmail,
  insertPhoto,
  getPhotoById,
  removePhoto
};