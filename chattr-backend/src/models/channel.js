import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


const ChannelSchema = mongoose.Schema({
    user1: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: ObjectId,
        ref: 'User',
        required: true,
    }
});

ChannelSchema.index({ user1: 1, user2: 1 }, { unique: true });

ChannelSchema.statics.get = async ({ friend }, { user }) => {
    const [ user1, user2 ] = [ friend, user ].sort();
    return ChannelModel.findOne({ user1, user2 }).populate('user1, user2');
}

ChannelSchema.statics.create = async ({ friend }, { user }) => {
    const [ user1, user2 ] = [ friend, user ].sort();
    let instance = new ChannelModel({ user1, user2 });
    return instance.save();
}


const ChannelModel = mongoose.model('Channel', ChannelSchema);

export {
    ChannelSchema,
    ChannelModel,
}