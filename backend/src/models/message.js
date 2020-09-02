const mongoose = require("mongoose");



const MessageSchema = mongoose.Schema({
    from: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
    }
});


const MessageModel = mongoose.model("Message", MessageSchema);



module.exports = {
    Schema: MessageSchema,
    Model: MessageModel
}