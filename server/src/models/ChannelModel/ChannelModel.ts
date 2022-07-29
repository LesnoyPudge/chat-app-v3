import { Schema, model, Types, ObjectId } from 'mongoose';



export interface IChannelModel {
    identifier: string; 
    avatar: string;
    name: string;
    owner: ObjectId;
    isPrivate: boolean;
    invitations: ObjectId[];
    members: ObjectId[];
    rooms: ObjectId[];
    roles: ObjectId[];
    banList: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ChannelSchema = new Schema<IChannelModel>(
    {
        identifier: { type: String, unique: true, required: true },
        avatar: { type: String, required: true },
        name: { type: String, required: true },
        owner: { type: Types.ObjectId, ref: 'User' },
        isPrivate: { type: Boolean, default: true },
        invitations: [{ type: Types.ObjectId, ref: 'Invitation' }],
        members: [{ type: Types.ObjectId, ref: 'User' }],
        rooms: [{ type: Types.ObjectId, ref: 'Room' }],
        roles: [{ type: Types.ObjectId, ref: 'Role' }],
        banList: [{ type: Types.ObjectId, ref: 'User' }],
    },
    { 
        timestamps: true, 
    },
);

export const ChannelModel = model<IChannelModel>('Channel', ChannelSchema);