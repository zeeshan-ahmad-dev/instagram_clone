const PostService = require("../services/post.service");

class PostController {
  async createPost(req, res) {
    try {
      const { caption } = req.body;
      const image = req.file;
      
      if (!image) {
        return res
          .status(400)
          .json({ message: "Missing required fields", success: false });
      }

      const imageUrl = `/uploads/posts/${image.filename}`;
      const post = await PostService.createPost(req, imageUrl, caption);

      if (!post) return res.status(500).json({ success: false, message: "Error creating post!" });

      res.status(201).json({ success: true, message: "Post created successfully!", post: post });
    } catch (error) {
      console.error("Error creating post:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
  async deletePost(req, res) {
    const postId = req.params.postId;

    try {
      await PostService.deletePost(req, postId);
      res
        .status(200)
        .json({ success: true, message: "Post deleted successfully!" });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  }

  async editPost(req, res) {
    const postId = req.params.postId;

    try {
      await PostService.editPost(req, postId, req.body);
      res
        .status(200)
        .json({ success: true, message: "Post edited successfully!" });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await PostService.getAllPosts();
      res
        .status(200)
        .json({ success: true, message: "Post edited successfully!", posts });
    } catch (error) {
      console.log(error);
      res.status(403).json({ success: false, message: error.message });
    }
  }

  async getPostsByUserId(req, res) {
    const userId = req.params.userId;
    try {
      const posts = await PostService.getPostsByUserId(userId);
      res
        .status(200)
        .json({ success: true, message: "Post Fetched successfully!", posts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPostById(req, res) {
    const postId = req.params.postId;
    try {
      const post = await PostService.getPostById(postId);
      res
        .status(200)
        .json({ success: true, message: "Post edited successfully!", post });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  }

  async likePost(req, res) {
    const postId = req.params.postId;

    try {
      const updatedPost = await PostService.likePost(req, postId);

      res
        .status(200)
        .json({ success: true, message: "Post Liked successfully!", post: updatedPost });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  }
  async unlikePost(req, res) {
    const postId = req.params.postId;

    try {
      const updatedPost = await PostService.unlikePost(req, postId);

      res
        .status(200)
        .json({ success: true, message: "Post UnLiked successfully!", post: updatedPost });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  }
}

module.exports = PostController;
