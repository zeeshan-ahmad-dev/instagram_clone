require('dotenv').config();
const mongoose = require('mongoose');

async function connectUsingMongoose() {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (error) {
        console.log("Error connecting mongodb");
        console.log(error);
    }
}

module.exports = connectUsingMongoose;
