import { Schema, model, Types, Document } from 'mongoose';



export interface ICategoriesSchema extends Document<Types.ObjectId> {
    name: string;
}

const CategoriesSchema = new Schema<ICategoriesSchema>(
    {
        name: { type: String, required: true },
    },
);

export interface IChannelModel extends Document<Types.ObjectId> {
    identifier: string; 
    avatar: string;
    name: string;
    owner: Types.ObjectId;
    isPrivate: boolean;
    members: Types.ObjectId[];
    rooms: Types.ObjectId[];
    roles: Types.ObjectId[];
    banList: {
        user: Types.ObjectId;
        reason: string;
    }[];
    invitations: {
        creator: Types.ObjectId;
        code: string;
        expiryDate: Date;
        createdAt: Date;
    }[];
    categories: ICategoriesSchema[];
    createdAt: Date;
    updatedAt: Date;
}

const ChannelSchema = new Schema<IChannelModel>(
    {
        identifier: { type: String, unique: true, required: true },
        avatar: { type: String, default: '' },
        name: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        isPrivate: { type: Boolean, default: true },
        invitations: [{
            creator: { type: Schema.Types.ObjectId, ref: 'User' },
            code: { type: String, required: true },
            expiryDate: { type: Date, required: true },
        }],
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        rooms: [{ type: Schema.Types.ObjectId, ref: 'Rooms' }],
        roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
        banList: [{
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            reason: { type: String, default: '' },
        }],
        categories: [{ type: CategoriesSchema }],
    },
    { 
        timestamps: true, 
    },
);

export const ChannelModel = model<IChannelModel>('Channel', ChannelSchema, 'Channel');