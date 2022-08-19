import { Schema, model, Types, Document } from 'mongoose';
import { ChatSchema, IChatSchema } from '@models/schemas';



export interface ITextRoomModel extends Document<Types.ObjectId> {
    name: string;
    identifier: string;
    channel: Types.ObjectId;
    // chat: Types.ObjectId;
    chat: IChatSchema;
    whiteList: {
        users: Types.ObjectId[];
        roles: Types.ObjectId[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const TextRoomSchema = new Schema<ITextRoomModel>(
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
    },
    { 
        timestamps: true, 
    },
);

export const TextRoomModel = model<ITextRoomModel>('TextRoom', TextRoomSchema, 'TextRoom');