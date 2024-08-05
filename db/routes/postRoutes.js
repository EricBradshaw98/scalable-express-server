const express = require('express');
const posts = express.Router();
const postsController = require('../controllers/postsController');

posts.get('/posts', postsController.getAllPosts);
posts.get('/posts/:id', postsController.getPostById);
posts.post('/posts', postsController.createPost);
posts.put('/posts/:id', postsController.updatePost);
posts.delete('/posts/:id', postsController.deletePost);

module.exports = posts;