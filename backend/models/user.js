const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');


const user_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    }
});


const user = mongoose.model("user", user_schema);


module.exports = user;


