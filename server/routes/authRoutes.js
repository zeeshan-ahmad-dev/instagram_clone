const express = require('express')
const passport = require('passport');
const { TokenController } = require('../controllers/auth.controller');

const authRoute = express.Router();
const tokenController = new TokenController();

authRoute.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

authRoute.get('/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        const user = req.user;
        const token = tokenController.GenerateToken(user);

        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.redirect(`${process.env.FRONTEND_URL}/profile/${user.id}`)
    }
)

authRoute.get('/facebook/auth-failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
})

module.exports = authRoute