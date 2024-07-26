const { query } = require("../db");

async function insertPostQuery(description, name, user_id, post_photo) {
  try {
    console.log("Inserting post with the following data:", { description, name, user_id, post_photo });
    
    const insertPostQuery = `
      INSERT INTO posts (description, name, user_id, photo, date_created, date_updated) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *`;
      
    const result = await query(insertPostQuery, [description, name, user_id, post_photo]);
    
    console.log("Post inserted successfully:", result.rows[0]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting post:", error);
    throw new Error(`Error inserting post: ${error.message}`);
  }
}


async function getEventByName(eventName) {
  
  try {
    
    const queryText = 'SELECT * FROM events WHERE event_name = $1';
    const { rows } = await query(queryText, [eventName]);

    
    if (rows.length === 0) {
      return null; 
    }

   
    return rows[0];
  } catch (error) {
    throw new Error("Error retrieving event by name: " + error.message);
  } 
}

async function deleteEventByName(eventName) {
 
  try {
    
    const queryText = 'DELETE FROM events WHERE event_name = $1';
    await query(queryText, [eventName]);
  } catch (error) {
    throw new Error("Error deleting event by name: " + error.message);
  } 
}









module.exports = {
  
  insertPostQuery
  
 
  
  
};