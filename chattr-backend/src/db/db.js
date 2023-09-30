import mongoose from 'mongoose';

mongoose.connection.on("connected", () => {
    console.log("Connection Established");
});

mongoose.connection.on("reconnected", () => {
    console.log("Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
    console.log("Connection Disconnected");
});

mongoose.connection.on("close", () => {
    console.log("Connection Closed");
});

mongoose.connection.on("error", error => {
    console.error(error);
});

const connect = async (DB_HOST, DB_NAME, DB_USER, DB_PASS) => mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_PASS,
    dbName: DB_NAME,
});

export default {
    connect
}
