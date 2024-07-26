const express = require('express');
require('dotenv').config();
const path = require('path');





const usersRoutes = require('./db/routes/usersRoutes');











const cors = require('cors');
const front = process.env.FRONT_ADDRESS;
const app = express();

const corsOptions = {
  origin: front,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const blockForeignOrigins = (req, res, next) => {
  const requestOrigin = req.headers.origin;
  
  if (requestOrigin !== front) {
    return res.status(403).json({ message: 'Forbidden: Access denied from this origin' });
  }

  res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  next();
};

if (process.env.ENABLE_CORS === 'true') {
  app.use(cors(corsOptions));
  app.use(blockForeignOrigins);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api', usersRoutes);

module.exports = app;
