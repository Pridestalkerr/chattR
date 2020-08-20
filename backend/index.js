const express = require("express");
const cors = require("cors");
const db = require("./db/db.js");
const validator = require("validator");
const user_model = require("./models/user.js");

const port = process.env.PORT || 8463;



async function main() {
    try {
        await db.connect(db_url);
    } catch (except) {
        console.log("Error during connection to the database:");
        console.error(except);
        process.exit(1);
    }

    const app = express();

    app.use(cors({
        origin: front_url,
        optionsSuccessStatus: 200,
        credentials: true,
    }));

    app.use(express.json());

    app.listen(port, () => console.log(`Server running on port ${port}.`));
}


await main();