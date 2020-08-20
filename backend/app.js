const express = require("express");
const db = require("./db/db.js");
const validator = require("validator");
const user_model = require("./models/user.js");

const port = process.env.PORT || 6969;


//connect to the database

db.connect("mongodb://localhost:27017/chattr-db").catch(() => {
	console.log("::::Error during connection.");
	process.exit(1);
});


const app = express();

app.use('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
   next();
});

app.get("/users", async (req, res) => {
	console.log("uw");
	res.send("users");
});

app.listen(port, () => console.log(`Server running on port ${port}`));