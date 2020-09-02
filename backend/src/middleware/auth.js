const jwt = require("jsonwebtoken");
const User = require("../models/user");



async function auth(req, res, next) {
    try {
        if (!req.header("Authorization")) {
            throw new Error({ error: "Not auth-ed" });
        }
        const token = req.header("Authorization").replace("Bearer ", '');
        const data = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.Model.findById(data._id);
        if (!user) {
            throw new Error({ error: "Not auth-ed" });
        }

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(300).redirect("/login");
    }
};



module.exports = auth;