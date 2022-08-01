import { Schema, model, Types, Document } from 'mongoose';



export interface IChannelModel extends Document<Types.ObjectId> {
    identifier: string; 
    avatar: string;
    name: string;
    owner: Types.ObjectId;
    isPrivate: boolean;
    invitations: Types.ObjectId[];
    members: Types.ObjectId[];
    rooms: Types.ObjectId[];
    roles: {
        users: Types.ObjectId[];
        role: Types.ObjectId;
    }[];
    banList: {
        user: Types.ObjectId;
        reason: string;
    }[];
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
        invitations: [{ type: Schema.Types.ObjectId, ref: 'Invitation' }],
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
        roles: [{
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            role: { type: Schema.Types.ObjectId, ref: 'Role' },
        }],
        banList: [{
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            reason: { type: String, default: '' },
        }],
    },
    { 
        timestamps: true, 
    },
);

export const ChannelModel = model<IChannelModel>('Channel', ChannelSchema);