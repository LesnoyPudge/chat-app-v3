import { Schema, model, Types, Document } from 'mongoose';



export interface IUserModel extends Document<Types.ObjectId> { 
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: 'default' | 'afk' | 'dnd' | 'invisible';
    activationLink: string;
    isActivated: boolean;
    settings: {
        theme: 'auto' | 'dark' | 'light';
        fontSize: number;
        messageGroupSpacing: number;
        transitionSpeed: number;
    }
    refreshJWT: string;
    // friendRequests: ObjectId[];
    // privateChats: ObjectId[];
    // blockList: ObjectId[];
    // appSettings: ObjectId;
    channels: Types.ObjectId[];
    // roles: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
    {
        login: { type: String, /*unique: true,*/ required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
        email: { type: String, required: true },
        extraStatus: { type: String, default: 'default' },
        activationLink: { type: String, required: true },
        isActivated: { type: Boolean, default: false },
        settings: {
            theme: { type: String, default: 'auto' },
            fontSize: { type: Number, default: 16 },
            messageGroupSpacing: { type: Number, default: 16 },
            transitionSpeed: { type: Number, default: 1 },
        },
        refreshJWT: { type: String, default: '' },
        channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
    },
    { 
        timestamps: true, 
    },
);

export const UserModel = model<IUserModel>('User', UserSchema);