const { query } = require("../db");

async function getUserByEmail(email) {
  try {
    const getUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await query(getUserQuery, [email]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving user by email: ${error.message}`);
  }
}

async function getUserById(id) {
  try {
    const getUserQuery = 'SELECT * FROM users WHERE id = $1';
    const result = await query(getUserQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error retrieving user by ID: ${error.message}`);
  }
}

async function insertUserQuery(email, password, firstName, lastName, username, token) {
  try {
    // Check if the email already exists
    const checkEmailQuery = `
      SELECT * FROM users WHERE email = $1 OR username = $2`;
    
    const emailResult = await query(checkEmailQuery, [email, username]);
    
    if (emailResult.rows.length > 0) {
      // If email already exists, throw an error
      throw new Error('Email or username already exists');
    }
    
    // Check if the token exists, matches the provided email, and is not used
    const checkTokenQuery = `
      SELECT * FROM tokens WHERE token = $1 AND email = $2 AND used = false`;
    
    const tokenResult = await query(checkTokenQuery, [token, email]);
    
    if (tokenResult.rows.length === 0) {
      // If token not found, email doesn't match, or token is already used, throw an error
      throw new Error('Invalid token, email, or token already used');
    }
    
    // If email and token are valid, proceed with inserting the user
    const insertUserQuery = `
      INSERT INTO users (email, password, first_name, last_name, username, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
      RETURNING *`;
      
    const result = await query(insertUserQuery, [email, password, firstName, lastName, username]);
    
    // Set the token as used in the tokens table
    const updateTokenQuery = `
  UPDATE tokens 
  SET used = true, date_updated = NOW() 
  WHERE token = $1`;
    
    await query(updateTokenQuery, [token]);
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error inserting user: ${error.message}`);
  }
}

async function removeUser(id) {
  try {
    const deleteUserQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await query(deleteUserQuery, [id]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Error deleting user by ID: ${error.message}`);
  }
}

async function getAdmin(email) {
  try {
    const getAdmin = 'SELECT * FROM users WHERE email = $1 AND admin = true RETURNING *';
    const result = await query(getAdmin, [email]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(`Getting admin error: ${error.message}`);
  }
}


module.exports = {
  getUserByEmail,
  insertUserQuery,
  getUserById,
  removeUser,
  getAdmin
};