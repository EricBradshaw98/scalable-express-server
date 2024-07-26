const { query } = require("../db");

async function getListingByEmail(email) {
  try {
    const getListingQuery = `
      SELECT l.*, u.* 
      FROM listings l
      INNER JOIN users u ON l.user_id = u.id
      WHERE u.email = $1`;
    const result = await query(getListingQuery, [email]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving listing by email: ${error.message}`);
  }
}


async function getListingById(id) {
  try {
    const getListingQuery = 'SELECT * FROM listings WHERE id = $1';
    const result = await query(getListingQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving user by ID: ${error.message}`);
  }
}

async function insertListing(name, user_id, imageurl, price, description) {
  try {
    const insertListingQuery = `
      INSERT INTO listings (name, user_id, imageurl, price, description, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
      RETURNING *`;
      
    const result = await query(insertListingQuery, [name, user_id, imageurl, price, description]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error inserting user: ${error.message}`);
  }
}

async function removeListing(id) {
  try {
    const deleteListingQuery = 'DELETE FROM listings WHERE id = $1 RETURNING *';
    const result = await query(deleteListingQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error deleting user by ID: ${error.message}`);
  }
}


module.exports = {
  getListingByEmail,
  insertListing,
  getListingById,
  removeListing
};