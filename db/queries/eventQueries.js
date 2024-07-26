const { query } = require("../db");

async function insertEventQuery(description, user_id, event_name, event_start, event_end, image, active) {
  try {
    const insertEventQuery = `
      INSERT INTO events (description, user_id, event_name, event_start, event_end, image, active, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING *`;
      
    const result = await query(insertEventQuery, [description, user_id, event_name, event_start, event_end, image, active]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error inserting event: ${error.message}`);
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
  
  insertEventQuery,
  getEventByName,
  deleteEventByName
  
  
};