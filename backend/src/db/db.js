const mongoose = require("mongoose");



mongoose.connection.on("connected", () => {
    console.log("Connection Established")
});

mongoose.connection.on("reconnected", () => {
    console.log("Connection Reestablished")
});

mongoose.connection.on("disconnected", () => {
    console.log("Connection Disconnected")
});

mongoose.connection.on("close", () => {
    console.log("Connection Closed")
});

mongoose.connection.on("error", error => {
    console.log("ERROR: " + error)
});



module.exports.connect = async url => mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});