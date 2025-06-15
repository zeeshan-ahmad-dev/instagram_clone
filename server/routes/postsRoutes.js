const express = require('express');
const multer = require('multer')
const path = require('path')
const PostController = require('../controllers/post.controller');

const postRoute = express.Router();

const postController = new PostController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts');
    }, 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

postRoute.get('/', postController.getAllPosts)
postRoute.get('/user/:userId', postController.getPostsByUserId)
postRoute.get('/:postId', postController.getPostById)
postRoute.post('/add', upload.single('image'), postController.createPost)
postRoute.delete('/delete/:postId', postController.deletePost)
postRoute.patch('/edit/:postId', postController.editPost)

postRoute.patch('/like/:postId', postController.likePost)
postRoute.patch('/unlike/:postId', postController.unlikePost)

module.exports = postRoute;