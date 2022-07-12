import {Schema, model, Types, pluralize} from 'mongoose';



export interface IUserModel {
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    // friendRequests: Types.ObjectId[];
    // privateChats: Types.ObjectId[];
    // blockList: Types.ObjectId[];
    // appSettings: Types.ObjectId;
    // channels: Types.ObjectId[];
    // roles: Types.ObjectId[];
}

pluralize(null);

const UserSchema = new Schema<IUserModel>(
    {
        login: {type: String, /*unique: true,*/ required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        avatar: {type: String, default: ''},
        email: {type: String, required: true},
    },
    { 
        timestamps: true, 
    },
);

export const UserModel = model<IUserModel>('User', UserSchema);