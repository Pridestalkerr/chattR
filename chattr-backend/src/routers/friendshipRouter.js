import express from 'express';
import auth from '../middleware/auth.js';
import { FriendshipRequestModel, FriendshipRequestSchema} from '../models/friendshipRequest.js';
import { FriendshipModel, FriendshipSchema} from '../models/friendship.js';

const router = express.Router();

router.post('/request/new', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        console.log(req.user)
        const query = await FriendshipRequestSchema.statics.create(req.body, { from: req.user._id });
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.post('/request/accept', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipRequestSchema.statics.accept(req.body, { to: req.user._id });
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.post('/request/cancel', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipRequestSchema.statics.revoke(req.body, { from: req.user._id });
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.post('/request/deny', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipRequestSchema.statics.revoke(req.body, { to: req.user._id });
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.post('/revoke', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipSchema.statics.revoke(req.body, { user1: req.user._id });
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.get('/request/incoming/all', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipRequestSchema.statics.getIncomingRequests(req.user);
        res.status(200).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.get('/request/sent/all', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        const query = await FriendshipRequestSchema.statics.getSentRequests(req.user);
        res.status(200).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

router.get('/all', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {

        // FriendshipModel.collection.drop();
        // FriendshipRequestModel.collection.drop();
        // console.log("ok")

        const query = await FriendshipSchema.statics.getFriends(req.user);

        console.log(req.path, query, req.user)
        res.status(200).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

export default router;