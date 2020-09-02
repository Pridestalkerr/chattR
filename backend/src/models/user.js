const mongoose = require("mongoose");
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
    },
    // sessions: [
    //     {

    //     }
    // ],
});

UserSchema.pre("save", async next => {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(
            user.password, process.env.SALT_ROUNDS
        );
    }

    next();
});

UserSchema.statics.create = async ({ username, email, password }) => {
    const user = new UserModel({
        username: username,
        email: email,
        password: password,
    });

    return user.save();
};

UserSchema.statics.auth = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error({ error: "Invalid login credentials." });
    }

    return user;
};

UserSchema.methods.generateAuthToken = async () => {
    const user = this;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
    });

    return token;
};


const UserModel = mongoose.model("User", UserSchema);



module.exports = {
    Schema: UserSchema,
    Model: UserModel
};