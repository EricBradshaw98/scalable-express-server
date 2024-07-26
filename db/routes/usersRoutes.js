const express = require('express');
const users = express.Router();
const usersController = require('../controllers/usersController');

users.get('/users', usersController.getAllUsers);
users.get('/users/:id', usersController.getUserById);
users.post('/users', usersController.createUser);
users.put('/users/:id', usersController.updateUser);
users.delete('/users/:id', usersController.deleteUser);

module.exports = users;
