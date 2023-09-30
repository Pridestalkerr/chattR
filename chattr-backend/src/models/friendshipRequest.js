import mongoose from 'mongoose';
import { FriendshipModel, FriendshipSchema} from './friendship.js';
import { UserModel, UserSchema} from './user.js';
const ObjectId = mongoose.Types.ObjectId;



const FriendshipRequestSchema = mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

FriendshipRequestSchema.index({ from: 1 });     // query for sent request
FriendshipRequestSchema.index({ to: 1 });       // query for incoming requests
FriendshipRequestSchema.index({ from: 1, to: 1 }, { unique: true });    // no duplicates

FriendshipRequestSchema.statics.getIncomingRequests = async ({ _id }) => {
    return FriendshipRequestModel.find({ to: ObjectId(_id) }).populate('from to');
}

FriendshipRequestSchema.statics.getSentRequests = async ({ _id }) => {
    return FriendshipRequestModel.find({ from: ObjectId(_id) }).populate('from to');
}

FriendshipRequestSchema.statics.create = async ({ to, email }, { from }) => {
    // make this atomic?
    if (email) {
        const { _id } = await UserSchema.statics.getByEmail(email);
        to = _id;
    }
    if ((await FriendshipModel.find({ user1: from, user2: to })).length) {
        throw new Error('Already friends');
    }
    let instance = new FriendshipRequestModel({
        from: ObjectId(from),
        to: ObjectId(to),
    });

    return instance.save();
}

// only 'to' can accept it
FriendshipRequestSchema.statics.accept = async ({ _id }, { to }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const instance = await FriendshipRequestModel.findOneAndDelete({
            _id: ObjectId(_id),
            to: ObjectId(to),
        });

        // after removing (accepting) the request, create the friendship between the users
        FriendshipSchema.statics.create({ user1: instance.from, user2: instance.to });

        await session.commitTransaction();
        session.endSession();
        return instance;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// both users can revoke the request
FriendshipRequestSchema.statics.revoke = async ({ _id }, { from, to }) => {
    return FriendshipRequestModel.deleteOne().or([
        { _id: ObjectId(_id), from: ObjectId(from) },
        { _id: ObjectId(_id), to: ObjectId(to) },
    ]);
}

const FriendshipRequestModel = mongoose.model('FriendshipRequest', FriendshipRequestSchema);

export {
    FriendshipRequestSchema,
    FriendshipRequestModel,
}