require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users');

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        profileFields: ['id', 'emails', 'name', 'picture.type(large)']
    },
    async function (accessToken, refreshTokne, profile, done) {
        try {
            const { id, name, emails, photos } = profile;
            
            let user = await User.findOne({facebookId: id});
            if (!user) {
                const newUser = new User({
                    facebookId: id,
                    fullName: name.givenName + " " + name.familyName,
                    username: `fb_user_${id}`,
                    email: emails?.[0]?.value || null,
                    password: 'no_password',
                    profilePicture: photos[0]?.value || null
                })
                await newUser.save();
                
                return done(null, {id: newUser._id, username: newUser.username,fullName: newUser.fullName, email: newUser.email, profilePicture: newUser.profilePicture});
            }
            return done(null, {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture
            });
        } catch (error) {
            console.error(error);
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})