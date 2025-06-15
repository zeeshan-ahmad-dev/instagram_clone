const Comment = require("../models/comment");
const Post = require("../models/post");


const Commentservices = {
    async getAllComments(postId) {
        try {
            const comments = await Comment.find({ post: postId });

            if (!comments) return { success: false, message: 'Unable to fetch comments!' }

            return { success: true, message: 'Comment fetched successfully!', comments };
        } catch (error) {
            throw new Error("Internal server error")
        }
    },
    async addComment(message, postId, userId, username, profilePicture) {
        try {
            const [post, comment] = await Promise.all([
                Post.findById(postId),
                Comment.create({
                    user: userId,
                    post: postId,
                    text: message,
                    username,
                    profilePicture,
                }),
            ]);
            if (!comment) return { success: false, message: 'Unable to post comment!' }

            post.comments.push(comment._id);
            await post.save();

            return { success: true, message: 'Comment added successfully!', comment };
        } catch (error) {
            throw new Error("Internal server error")
        }
    }
}

module.exports = Commentservices;