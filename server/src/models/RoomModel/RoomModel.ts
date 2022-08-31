import { Schema, model, Types, Document } from 'mongoose';
import { ChatSchema, IChatSchema } from '@models/schemas';



export interface IRoomModel extends Document<Types.ObjectId> {
    name: string;
    identifier: string;
    channel: Types.ObjectId;
    chat: IChatSchema;
    whiteList: {
        users: Types.ObjectId[];
        roles: Types.ObjectId[];
    };
    type: 'voice' | 'text';
    category: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const RoomSchema = new Schema<IRoomModel>(
    {
        identifier: { type: String, required: true },
        name: { type: String, required: true },
        channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
        chat: {
            type: ChatSchema,
            default: () => ({}),
        },
        whiteList: {
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
        },
        type: { type: String, required: true },
        category: { type: Schema.Types.ObjectId },
    },
    { 
        timestamps: true, 
    },
);

export const RoomModel = model<IRoomModel>('Room', RoomSchema, 'Room');