require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const usersRoute = require('./routes/usersRoutes');
const postsRoute = require('./routes/postsRoutes');
const commentRoute = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/auth');
const connectUsingMongoose = require('./configs/mongooseConfig');
require('./configs/passport');

const app = express();

app.set("trust proxy", 1);

// Initialize MongoDB connection
connectUsingMongoose(); 

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true, 
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}))

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', usersRoute)
app.use('/auth/', authRoutes)
app.use('/api/post/', authMiddleware, postsRoute)
app.use('/api/comments/', authMiddleware, commentRoute)

app.listen(PORT, () => console.log(`Server is listening on PORT: http://localhost:${PORT}`))