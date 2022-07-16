import { Schema, model, Types } from 'mongoose';
import { IUserModel } from '../../types';



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