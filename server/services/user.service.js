const mongoose = require('mongoose');
const User = require("../models/users");
const Post = require("../models/post");
const { TokenController } = require('../controllers/auth.controller');

const tokenController = new TokenController();

const UserService = {
    async getPublicProfile(userId) {
        try {
            const id = new mongoose.Types.ObjectId(userId)
            const user = await User.findById(id);
            const posts = await Post.find({user:id});
            
            if (!user) throw new Error("No user found!");

            return { success: true, user, posts };        
        } catch (error) {
            console.log(error)
            throw new Error("Failed to get the user profile");
        }
    },
    async getMyProfile(token) {
        try {
            const payload = tokenController.VerifyToken(token);
            
            const userId = new mongoose.Types.ObjectId(payload.id);
            const [ user, posts ] = await Promise.all([User.findById(userId), Post.find({user:userId})])
            if (!user) throw new Error("No user found!");

            return { success: true, user, posts };        
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user Profile");
        }
    },
    async getSuggestedUsers(token) {
        try {
            const payload = tokenController.VerifyToken(token);
            
            const users = await User.find({}).limit(6);
            if (!users) throw new Error("No users found!");

            return { success: true, users };        
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get user Profile");
        }
    },
    async followUser(req, userId) {
        try {
            const followedUser = await User.findById(userId);
            const followingUser = await User.findById(req.user.id);
            
            if (followedUser.followers.includes(req.user.id)) throw new Error("Already following this user!");

            if (!followedUser || !followingUser) throw new Error("No user found!");

            followedUser.followers.push(req.user.id);
            followingUser.following.push(userId);

            await followedUser.save();
            await followingUser.save();

            return { success: true, message: "User followed successfully." };        
        } catch (error) {
            console.log("Followed user actual error:",error)
            throw new Error("Failed to follow user");
        }
    },
    async unFollowUser(req, userId) {
        try {
            const followedUser = await User.findById(userId);
            const followingUser = await User.findById(req.user.id);
            
            if (!followedUser || !followingUser) throw new Error("No user found!");
            
            if (!followedUser.followers.includes(req.user.id)) throw new Error("Already not following this user!");

            followedUser.followers = followedUser.followers.filter(
                id => id.toString() !== req.user.id.toString()
            );
            followingUser.following = followingUser.following.filter(
                id => id.toString() !== userId.toString()
            );

            await Promise.all([followedUser.save(), followingUser.save()])

            return { success: true, message: "User unfollowed successfully." };        
        } catch (error) {
            throw new Error("Failed to unfollow user");
        }
    },

    async updateMyProfile(req, bio, profilePicture) {
        try {
            const user = await User.findById(req.user.id); 
            const posts = Post.find({user:req.user.id});
            
            if (!user) throw new Error("No user found!");

            user.bio = bio || user.bio;
            user.profilePicture = profilePicture || user.profilePicture;

            user.save();

            return { success: true, user, posts };        
        } catch (error) {
            console.log('Updating profile actual error: ', error)
            throw new Error("Failed to unfollow user");
        }
    }
}

module.exports = {
    UserService
}