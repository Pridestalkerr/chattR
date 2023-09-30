import mongoose from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
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
});

UserSchema.statics.getById = async (_id) => {
    return UserModel.findById(_id);
}

UserSchema.statics.getByEmail = async (email) => {
    return UserModel.findOne({ email });
}

UserSchema.statics.create = async ({ username, email, password }) => {
    console.log("??????")
    let instance = new UserModel({
        username,
        email,
        password: await argon2.hash(password),
    })

    console.log("??")

    return instance.save();
}

UserSchema.statics.authenticate = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });

    console.log(user)

    if (!user || !await argon2.verify(user.password, password)) {
        throw new Error({ error: "Invalid credentials." });
    }

    return user;
}

UserSchema.methods.generateAccessToken = async function() {
    const user = this;

    const access_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_ACCESS, {
        expiresIn: "15m"
    });

    return access_token;
}

UserSchema.methods.generateRefreshToken = async function() {
    const user = this;

    const refresh_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: "7d"
    });

    return refresh_token;
}

UserSchema.methods.generateTokens = async function() {
    const user = this;
    
    return {
        access_token: await user.generateAccessToken(),
        refresh_token: await user.generateRefreshToken(),
    }
}

const UserModel = mongoose.model('User', UserSchema);

export {
    UserSchema,
    UserModel,
}