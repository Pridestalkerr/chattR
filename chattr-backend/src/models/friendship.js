import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


const FriendshipSchema = mongoose.Schema({
    user1: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
});

FriendshipSchema.index({ user1: 1 });

FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

FriendshipSchema.statics.getFriends = async ({ _id }) => {
    let res = await FriendshipModel.find({});
    console.log(res)
    return FriendshipModel.find({ user1: ObjectId(_id) }).populate('user1 user2');
}

FriendshipSchema.statics.create = async ({ user1, user2 }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let instance1 = await new FriendshipModel({
            user1: ObjectId(user1),
            user2: ObjectId(user2),
        }).save();
    
        let instance2 = await new FriendshipModel({
            user1: ObjectId(user2),
            user2: ObjectId(user1),
        }).save();

        await session.commitTransaction();
        session.endSession();
        return [ instance1, instance2 ];

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

FriendshipSchema.statics.revoke = async ({ user2 }, { user1 }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await FriendshipModel.deleteOne({ user1, user2 });
        await FriendshipModel.deleteOne({ user2: user1, user1: user2 });

        await session.commitTransaction();
        session.endSession();
        return;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

const FriendshipModel = mongoose.model('Friendship', FriendshipSchema);

export {
    FriendshipSchema,
    FriendshipModel,
}