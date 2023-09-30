import express from 'express';
import { UserModel, UserSchema} from '../models/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('hello');
    auth();
});

export default router;