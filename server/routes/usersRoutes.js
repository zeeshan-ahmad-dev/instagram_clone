const express = require("express");
const path = require('path');
const { AuthController }  = require('../controllers/controllers');
const { ProfileController }  = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');

const router = express.Router();

const authController = new AuthController();
const profileController = new ProfileController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profilePics');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
})

const upload = multer({ storage });

router.post("/signup", authController.createUser);
router.post("/signin", authController.signInUser);
router.post("/signout", authController.signOutUser);

router.post('/follow/:userId', authMiddleware, profileController.followUser)
router.post('/unfollow/:userId', authMiddleware, profileController.unFollowUser)

router.get('/profile/:id', authMiddleware, profileController.getPublicProfile)
router.get('/me', authMiddleware, profileController.getMyProfile)
router.get('/', authMiddleware, profileController.getSuggestedUsers)
router.post('/update/me',upload.single('image'), authMiddleware, profileController.updateMyProfile)

module.exports = router;
