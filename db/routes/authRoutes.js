const express = require('express');
const auth = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController')

// Define authentication routes
auth.post('/register', authController.registerUser);
auth.post('/login', usersController.loginUser);
auth.post('/logout', usersController.logoutUser);
auth.post('/forgot-password', authController.forgotPassword);
auth.post('/reset-password', authController.resetPassword);
auth.get('/confirm/:token', authController.confirmToken);
auth.post('/test-email', authController.testEmail);

module.exports = auth;
