import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


const MessageSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    from: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    channel: {
        type: ObjectId,
        ref: 'Channel',
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

// MessageSchema.index({ from: 1, channel: 1 }, { unique: false });
MessageSchema.index({ channel: 1, _id: -1 }, { unique: true });

MessageSchema.statics.getMessagesBetween = async ({ channel }, { start_id, count }) => {
    // await MessageModel.collection.drop()
    if (!start_id) {
        return MessageModel.find({
            channel: ObjectId(channel),
        }).limit(count).populate('from channel');
    }
    return MessageModel.find({
        channel: ObjectId(channel),
        _id: { $lt: ObjectId(start_id) },
    }).sort({ _id: -1 }).limit(count).populate('from channel');
}

MessageSchema.statics.create = async ({ from, channel, content }) => {
    let instance = new MessageModel({
        from: ObjectId(from),
        channel: ObjectId(channel),
        content
    });

    return instance.save()
}

const MessageModel = mongoose.model('Message', MessageSchema);

export {
    MessageSchema,
    MessageModel,
}