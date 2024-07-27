const express = require('express');
const conversations = express.Router();
const conversationsController = require('../controllers/conversationsController');


conversations.get('/conversations', conversationsController.getAllConversations);
conversations.get('/conversationsuser/:id', conversationsController.getAllConversationsForUser);
conversations.get('/conversations/:id', conversationsController.getConversation);
conversations.post('/conversations', conversationsController.createConversation);
conversations.delete('/conversations/:id', conversationsController.deleteConversation);
conversations.put('/conversations/:id', conversationsController.updateConversation);

module.exports = conversations;