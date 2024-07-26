const express = require('express');
require('dotenv').config();
const path = require('path');





const usersRoutes = require('./db/routes/usersRoutes');
const authRoutes = require('./db/routes/authRoutes'); // Import auth routes
const uploadRoutes = require('./db/routes/uploadRoutes');
const auth = require('./utilities/auth');











const cors = require('cors');
const front = process.env.FRONT_ADDRESS || 'http://172.23.223.142:3000';
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
app.use('/api/auth', authRoutes); 
app.use('/api/uploads', uploadRoutes); 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


module.exports = app;
