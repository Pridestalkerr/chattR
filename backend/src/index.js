const express = require("express");
const cors = require("./middleware/cors");
const db = require("./db/db");



async function main() {

    const PORT = process.env.PORT || 8463;
    const DBURL = process.env.DBURL || "mongodb://localhost:27017/chattr";
    const FRONTURL = process.env.FRONTURL || "http://localhost:3000";

    try {
        await db.connect(DBURL);
    } catch (except) {
        console.log("Error during connection to the database:");
        console.error(except);
        process.exit(1);
    }

    const app = express();

    app.use(cors(FRONTURL));
    app.use(express.json());

    const server = app.listen(PORT,
        () => console.log(`Server running on port ${PORT}.`)
    );
}

main();