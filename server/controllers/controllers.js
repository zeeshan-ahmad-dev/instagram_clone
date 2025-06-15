const bcrypt = require("bcrypt");
const User = require('../models/users');
const { TokenController }  = require('./auth.controller');

const tokenController = new TokenController();


class AuthController {
  createUser = async (req, res) => {
    const { username, fullName, email, password, profilePicture } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Username or email already exists" });
      }

      const user = await User.create({
        username,
        fullName,
        email,
        password,
        profilePicture,
        facebookId: Math.floor(Math.random() * 1000000)
      })

      const token = tokenController.GenerateToken(user);

      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: "Lax" })
      res.status(201).json({ 
        success: true,
        message: "User create successfully!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          fullName: user.fullName,
          followers: user.followers.length,
          following: user.following.length,
        },
        posts: []
     });
    } catch (error) {
      console.log(`Error: ${error}`)
      res.status(500).json({ success: false, message: error.message });
    }
  };

  signInUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {  
        return res.status(404).json({ success: false, message: "User not found!" });
      }

      const isMatched = await bcrypt.compare(password, user.password)
      if (!isMatched) {
        return res.status(401).json({ success: false, message: "Incorrect Password!" });
      }

      const token = tokenController.GenerateToken(user);
      res.cookie('token', token, {httpOnly: true, secure: false, sameSite: 'Lax'});
      res.status(201).json({ 
        success: true,
        message: "User logedIn successfully!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          fullName: user.fullName,
          followers: user.followers.length,
          following: user.following.length
        },
        posts: []
     });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  };
  signOutUser = async (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    });
    res.status(200).json({success: true, message: "Logout successfully!"})
  }
}

module.exports = {
    AuthController
}