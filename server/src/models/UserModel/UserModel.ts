import { Schema, model, Types, Document } from 'mongoose';



export interface IUserModel extends Document<Types.ObjectId> { 
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: 'default' | 'afk' | 'dnd' | 'invisible';
    activationCode: string;
    isActivated: boolean;
    refreshJWT: string;
    blockList: Types.ObjectId[];
    channels: Types.ObjectId[];
    privateChannels: Types.ObjectId[];
    friends: Types.ObjectId[];
    accessCode: {
        code: string,
        expiryDate: Date,
    };
    settings: {
        theme: 'auto' | 'dark' | 'light';
        fontSize: 12 | 14 | 16 | 18 | 20;
        messageGroupSpacing: 16 | 20;
        transitionSpeedModifier: 0 | 0.5 | 1 | 1.5 | 2;
    };
    friendRequests: {
        incoming: {
            from: Types.ObjectId;
            createdAt: Date;
        }[];
        outgoing: {
            to: Types.ObjectId;
            createdAt: Date;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
    {
        login: { type: String, /*unique: true,*/ required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
        email: { type: String, default: '' },
        extraStatus: { type: String, default: 'default' },
        activationCode: { type: String, required: true },
        isActivated: { type: Boolean, default: false },
        blockList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        accessCode: {
            code: { type: String, required: true },
            expiryDate: { type: Date, required: true },
        },
        settings: {
            theme: { type: String, default: 'auto' },
            fontSize: { type: Number, default: 16 },
            messageGroupSpacing: { type: Number, default: 16 },
            transitionSpeedModifier: { type: Number, default: 1 },
        },
        refreshJWT: { type: String, default: '' },
        channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
        privateChannels: [{ type: Schema.Types.ObjectId, ref: 'PrivateChannel' }],
        friendRequests: {
            incoming: [{
                from: { type: Schema.Types.ObjectId, ref: 'User' },
                createdAt: { type: Date, default: Date.now },
            }],
            outgoing: [{
                to: { type: Schema.Types.ObjectId, ref: 'User' },
                createdAt: { type: Date, default: Date.now },
            }],
        },
    },
    { 
        timestamps: true, 
    },
);

export const UserModel = model<IUserModel>('User', UserSchema, 'User');