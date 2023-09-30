import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './db/db.js'
import userRouter from './routers/userRouter.js';
import authRouter from './routers/authRouter.js';
import friendshipRouter from './routers/friendshipRouter.js';
import channelRouter from './routers/channelRouter.js';
import cors from 'cors';

import { createServer } from 'http';
import { Server as socketServer } from 'socket.io';
import socketCookieParser from 'socket.io-cookie-parser';
import jwt from 'jsonwebtoken';

import { MessageModel, MessageSchema } from './models/message.js';


const main = async () => {
    dotenv.config();
    const PORT = process.env.PORT || 9000;
    const DB_HOST = process.env.DB_HOST || 'mongodb://localhost:27017';
    const DB_NAME = process.env.DB_NAME || 'chattr';
    const DB_USER = process.env.DB_USER || 'root';
    const DB_PASS = process.env.DB_PASS || 'password';
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    console.log(DB_HOST, DB_NAME, DB_USER, DB_PASS, FRONTEND_URL)
    
    try {
        await db.connect(DB_HOST, DB_NAME, DB_USER, DB_PASS);
    } catch(except) {
        console.log('Error during connection to the database:');
        console.error(except);
        process.exit(1);
    }

    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: FRONTEND_URL, credentials: true }));
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/friendship', friendshipRouter);
    app.use('/channel', channelRouter);

    const server = createServer(app);

    const io = new socketServer(server, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
        // cookie: {
        //     name: "access_token",
        //     httpOnly: true,
        //     path: '/socket.io/'
        //     // sameSite: "strict",
        //     // maxAge: 86400
        // }
    });
    io.use(socketCookieParser());

    io.use((client, next) => {
        const { access_token } = client.request.cookies;
        if (!access_token) {
            console.log(access_token, " failed authentication")
            next(new Error('Unauthorized'));
        }

        const { _id } = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS);
        client._id = _id;

        next();
    })

    io.on('connection', client => {
        console.log(client._id, " connected")

        client.on('join', ({ channel }) => {
            console.log(client._id, " joins ", channel)
            client.join(channel);
        })

        client.on('leave', ({ channel }) => {
            console.log(client._id, " leaves ", channel)
            client.leave(channel);
        })

        client.on('message', async ({ channel, content }) => {
            console.log(client._id, " to ", channel, " content ", content)
            let msg = await MessageSchema.statics.create({
                from: client._id,
                channel,
                content,
            });
            io.to(channel).emit('message', msg);
        })

        client.on('get_messages', async ({ channel }, { start_id, count }) => {
            console.log(client._id, " from ", channel, " get ", start_id, count)
            let query = await MessageSchema.statics.getMessagesBetween({ channel }, { start_id, count });
            console.log(query)
            io.to(client.id).emit('get_messages', query);
        })
    });


    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`)
    });
}

main();