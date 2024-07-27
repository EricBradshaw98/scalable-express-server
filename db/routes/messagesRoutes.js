const express = require('express');
const messages = express.Router();
const messagesController = require('../controllers/messagesController');


messages.get('/messages', messagesController.getAllMessages);
messages.get('/messages/:id', messagesController.getMessage);
messages.post('/messages', messagesController.createMessage);
messages.delete('/messages/:id', messagesController.deleteMessage);
messages.put('/messages/:id', messagesController.updateMessage);

module.exports = messages;