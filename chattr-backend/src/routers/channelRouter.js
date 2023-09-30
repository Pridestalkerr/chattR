import express from 'express';
import auth from '../middleware/auth.js';
import { ChannelModel, ChannelSchema} from '../models/channel.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    if (process.env.DEBUG) console.log(req.path);
    try {
        let query = await ChannelSchema.statics.get(req.query, { user: req.user._id });
        if (!query) {
            query = await ChannelSchema.statics.create(req.query, { user: req.user._id });
        }
        res.status(201).send(query);

    } catch (error) {
        if (process.env.DEBUG) console.error(error);
        res.status(500).send(error)
    }
});

export default router;