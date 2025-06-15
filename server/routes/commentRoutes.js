const express = require('express');
const CommentController = require('../controllers/comment.controller');

const commentRoute = express.Router();

const commentController = new CommentController();

commentRoute.get('/:postId', commentController.getAllComments)
commentRoute.post('/add/:postId', commentController.addComment)

module.exports = commentRoute;