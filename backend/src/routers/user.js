const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");



const userRouter = express.Router();

userRouter.post("/user/register", async (req, res) => {
    try {

        const user = await User.Schema.statics.create(req);

        const token = await user.generateAuthToken();

        res.status(201).send({
            user,
            token,
        });

    } catch (error) {

        res.status(400).send(error);
    }
});

userRouter.post("/user/login", async (req, res) => {
    try {
        const user = await User.Model.auth(email, password);
        if (!user) {
            res.status(401).send({
                error: "Wrong credentials."
            });
        }
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

userRouter.get("/user/status", auth, async (req, res) => {
    res.status(200).send(req.user);
});



module.exports = userRouter;