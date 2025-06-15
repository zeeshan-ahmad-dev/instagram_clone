const Post = require("../models/post");
const Comment = require("../models/comment");

const PostService = {
  async createPost(req, imageUrl, caption) {
    try {
      const post = await Post.create({
        user: req.user.id,
        image: imageUrl,
        caption: caption || " ",
      });
      return post;
    } catch (error) {
      console.log("Failed to create file!");
      throw new Error("Failed to create post!");
    }
  },

  async deletePost(req, postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      if (post.user.toString() !== req.user.id.toString()) {
        throw new Error("Unauthorized to delete this post!");
      }

      await Post.deleteOne({ _id: postId });
      return true;
    } catch (error) {
      console.error("Error deleting post: ", error);
      throw new Error("Failed to delete post");
    }
  },

  async editPost(req, postId, postObj) {
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      if (post.user.toString() !== req.user.id.toString()) {
        throw new Error("Unauthorized to edit this post!");
      }

      post.caption = postObj.caption;
      await post.save();
      return post;
    } catch (error) {
      throw new Error("Failed to edit post");
    }
  },

  async getAllPosts() {
    try {
      Comment.find({});
      const posts = await Post.find({})
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .populate({
        path: 'comments',
        select: 'text user',
        populate: {
          path: 'user',
          select: 'username profilePicture'
        },
      });
      if (!posts) throw new Error("Post not found!");

      return posts;
    } catch (error) {
      console.error("Original error in getAllPosts:", error);
      throw new Error("Failed to get all posts");
    }
  },

  async getPostsByUserId(userId) {
    try {
      const posts = await Post.find({user: userId});
      return posts;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  },

  async getPostById(postId) {
    try {
      const post = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .populate({
        path: 'comments',
        select: 'text user',
        populate: {
          path: 'user',
          select: 'username profilePicture'
        },
      });
      if (!post) throw new Error("Post not found!");

      return post;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  },

  async likePost(req, postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      if (post.likes.includes(req.user.id)) {
        throw new Error("Post is already liked!");
      }
      post.likes.push(req.user.id);
      await post.save();
      return post;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  },

  async unlikePost(req, postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      post.likes = post.likes.filter(id => !id.equals(req.user.id));
      await post.save();
      return post;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  },

}

module.exports = PostService;
