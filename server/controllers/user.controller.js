const { UserService } = require("../services/user.service");
const { TokenController } = require('../controllers/auth.controller');

const tokenController = new TokenController();

class ProfileController {
    async getPublicProfile(req, res) {
        const userId = req.params.id;
        try {
            const result = await UserService.getPublicProfile(userId);
            const user = {
                id: result.user._id,
                email: result.user.email,
                username: result.user.username,
                fullName: result.user.fullName,
                profilePicture: result.user.profilePicture,
                followers: result.user.followers,
                following: result.user.following,
                bio: result.user.bio
            };

            res.status(200).json({ success: result.success, message: result.message, user, posts: result.posts });
        } catch (error) {
            console.error("Geting public profile error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }
    async getMyProfile(req, res) {
        try {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
            const result = await UserService.getMyProfile(token);
            const user = {
                id: result.user._id,
                email: result.user.email,
                username: result.user.username,
                fullName: result.user.fullName,
                profilePicture: result.user.profilePicture,
                followers: result.user.followers.length,
                following: result.user.following.length,
                bio: result.user.bio,
            }
            res.status(200).json({ success: result.success, user, posts: result.posts });
        } catch (error) {
            console.error("Getting profile error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }
    
    async getSuggestedUsers(req, res) {
        try {
            const token = req.cookies.token;
            if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

            const result = await UserService.getSuggestedUsers(token);
            res.status(200).json({ success: result.success, users: result.users });
        } catch (error) {
            console.error("Getting all users error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }

    async followUser(req, res) {
        const userId = req.params.userId;
        try {
            if (userId === req.user.id) {
                return res.status(400).json({ success: false, message: "You cannot follow yourself" })
            }
            const result = await UserService.followUser(req, userId);
            res.status(200).json({ success: result.success, message: result.message });
        } catch (error) {
            console.error("Follow error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }

    async unFollowUser(req, res) {
        const userId = req.params.userId;
        try {
            const result = await UserService.unFollowUser(req, userId);
            res.status(200).json({ success: result.success, message: result.message });
        } catch (error) {
            console.error("unfollow error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }

    async updateMyProfile(req, res) {
        try {
            const { bio } = req.body;
            let image = req.file;
            let profilePicture;
            if (!image) {
                profilePicture = req.user.profilePicture;
            } else {
                profilePicture = `/uploads/profilePics/${image.filename}`;
            }

            const result = await UserService.updateMyProfile(req, bio, profilePicture);
            const user = {
                _id: result.user._id,
                email: result.user.email,
                username: result.user.username,
                fullName: result.user.fullName,
                profilePicture: result.user.profilePicture,
            }
            res.status(200).json({ success: result.success, message: result.message, user });
        } catch (error) {
            console.error("update profile error:", error.message);
            res.status(403).json({ success: false, message: error.message });
        }
    }
}

module.exports = {ProfileController};
