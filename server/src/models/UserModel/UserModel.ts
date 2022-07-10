import {Schema, model, Types} from 'mongoose';



export interface IUser {
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    createdAt: Date;
    // friendRequests: Types.ObjectId[];
    // privateChats: Types.ObjectId[];
    // blockList: Types.ObjectId[];
    // appSettings: Types.ObjectId;
    // channels: Types.ObjectId[];
    // roles: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    login: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    email: {type: String, required: true},
    createdAt: {type: Date, immutable: true, default: () => Date.now()},
});

export const UserModel = model<IUser>('User', UserSchema);