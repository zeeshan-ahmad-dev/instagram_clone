const { UserService } = require("../services/user.service");
const cloudinary = require("../configs/cloudinary");
const { TokenController } = require("../controllers/auth.controller");

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
        bio: result.user.bio,
      };

      res.status(200).json({
        success: result.success,
        message: result.message,
        user,
        posts: result.posts,
      });
    } catch (error) {
      console.error("Geting public profile error:", error.message);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
  async getMyProfile(req, res) {
    try {
      const token = req.cookies.token;
      if (!token)
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
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
        savedPosts: result.user.savedPosts,
      };
      res
        .status(200)
        .json({ success: result.success, user, posts: result.posts });
    } catch (error) {
      console.error("Getting profile error:", error.message);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }

  async getSuggestedUsers(req, res) {
    try {
      const token = req.cookies.token;
      if (!token)
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });

      const result = await UserService.getSuggestedUsers(token);
      res.status(200).json({ success: result.success, users: result.users });
    } catch (error) {
      console.error("Getting all users error:", error.message);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }

  async followUser(req, res) {
    const userId = req.params.userId;
    try {
      if (userId === req.user.id) {
        return res
          .status(400)
          .json({ success: false, message: "You cannot follow yourself" });
      }
      const result = await UserService.followUser(req, userId);
      res
        .status(200)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error("Follow error:", error.message);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }

  async unFollowUser(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserService.unFollowUser(req, userId);
      res
        .status(200)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      console.error("unfollow error:", error.message);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }

  async updateMyProfile(req, res) {
    try {
      const { bio } = req.body;
      let image = req.file;
      let publicId;
      let pfp;

      const { pfpPublicId } = await UserService.getUserData(
        req.user.id,
      );

      if (image) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "insta_clone/pfp" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(image.buffer);
        });

        pfp = result.secure_url;
        publicId = result.public_id;

        if (pfpPublicId) {
          const destroyResult = await cloudinary.uploader.destroy(pfpPublicId);
          console.log("Destroy result:", destroyResult);
        }
      }

      const userResponse = await UserService.updateMyProfile(
        req,
        bio,
        pfp,
        publicId,
      );
      const user = {
        _id: userResponse.user._id,
        email: userResponse.user.email,
        username: userResponse.user.username,
        fullName: userResponse.user.fullName,
        profilePicture: userResponse.user.profilePicture,
      };

      res
        .status(200)
        .json({
          success: userResponse.success,
          message: userResponse.message,
          user,
        });
    } catch (error) {
      console.error("update profile error:", error);
      res
        .status(error.status || 500)
        .json({ success: false, message: error.message });
    }
  }
}

module.exports = { ProfileController };
