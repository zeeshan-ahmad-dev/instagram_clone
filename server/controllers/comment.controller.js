const CommentService = require('../services/comment.service');

class CommentController {
    async getAllComments(req, res) {
        const postId = req.params.postId;
        try {
            const result = await CommentService.getAllComments(postId);

            if (!result.success) {
                return res.status(404).json(result); 
            }

            return res.status(201).json({ success: result.success, message: result.message, comments: result.comments });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async addComment(req, res) {
        try {
            const { message, postId, userId, username, pfp } = req.body;
            const result = await CommentService.addComment(message, postId, userId, username, pfp);
            
            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({ success: result.success, message: result.message, comment: result.comment });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async editComment(req, res) {
        const message = req.body.message;
        const commentId = req.params.commentId;
        const userId = req.user.id;
        try {
            const result = await CommentService.editComment(message, commentId, userId);
            
            if (!result.success) {
                const status = result.message.includes('Unauthorized') ? 403 : 404;
                return res.status(status).json(result); // 403 if not your comment, 404 if comment not found
            }

            return res.status(200).json({ success: result.success, message: result.message, comment: result.comment });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = CommentController;