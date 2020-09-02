const cors = require("cors");



module.exports = url => cors({
    origin: url,
    optionsSuccessStatus: 200,
    credentials: true,
});