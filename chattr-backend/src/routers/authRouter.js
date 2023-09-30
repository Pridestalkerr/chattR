import express from 'express';
import auth from '../middleware/auth.js';
import { UserModel, UserSchema} from '../models/user.js';

import argon2 from 'argon2';

const router = express.Router();

router.post('/register', async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const user = await UserSchema.statics.create(req.body);
        res.status(201).send(user);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.post('/login', async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const user = await UserSchema.statics.authenticate(req.body);
        const { access_token, refresh_token } = await user.generateTokens();

        res.status(200).cookie('access_token', access_token, {
            httpOnly: true,
        }).cookie('refresh_token', refresh_token, {
            httpOnly: true,
        }).send(user);
        
    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.get('/access', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    res.status(200).send(req.user);    // auth middleware takes care of it
});

router.get('/logout', async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);

    res.status(200).clearCookie('access_token').clearCookie('refresh_token').send();
});

export default router;