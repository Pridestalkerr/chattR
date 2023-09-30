import jwt from 'jsonwebtoken';
import { UserModel, UserSchema} from '../models/user.js';

export default async (req, res, next) => {
    const { access_token, refresh_token } = req.cookies;

    try {
        if (!access_token || !refresh_token) {
            throw new Error({ error: 'Missing authentication tokens.' });
        }
        
        try {
            const _id = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS);
            req.user = await UserSchema.statics.getById(_id);
        } catch (error) {
            // try refresh token
            if (error.name === 'TokenExpiredError') {
                const _id = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH);
                req.user = await UserSchema.statics.getById(_id);
                res.cookie('access_token', await req.user.generateAccessToken(), {
                    httpOnly: true,
                });
            } else {
                throw error;
            }
        }
        next();

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(401).send(error);
    }
}