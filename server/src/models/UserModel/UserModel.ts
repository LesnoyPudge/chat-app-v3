import { Schema, model, Types, ObjectId } from 'mongoose';



export interface IUserModel { 
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
    createdAt: Date;
    updatedAt: Date;
    // friendRequests: ObjectId[];
    // privateChats: ObjectId[];
    // blockList: ObjectId[];
    // appSettings: ObjectId;
    // channels: ObjectId[];
    // roles: ObjectId[];
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
    },
    { 
        timestamps: true, 
    },
);

export const UserModel = model<IUserModel>('User', UserSchema);