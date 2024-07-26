const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utilities/blacklist');
require('dotenv').config();

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log(`Checking token: ${token}`);

  if (await isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been blacklisted. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;
