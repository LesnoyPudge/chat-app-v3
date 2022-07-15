import { Schema, model, Types } from 'mongoose';
import { ExtraStatus, IUser } from '../../types/API/User/User';



const UserSchema = new Schema<IUser>(
    {
        login: { type: String, /*unique: true,*/ required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
        email: { type: String, required: true },
        extraStatus: { type: String, default: ExtraStatus.NONE },
    },
    { 
        timestamps: true, 
    },
);

export const UserModel = model<IUser>('User', UserSchema);