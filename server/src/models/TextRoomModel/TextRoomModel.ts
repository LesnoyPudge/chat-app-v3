import { Schema, model, Types, Document } from 'mongoose';



export interface ITextRoomModel extends Document<Types.ObjectId> {
    name: string;
    identifier: string;
    channel: Types.ObjectId;
    // chat: Types.ObjectId;
    chat: string;
    whiteList: {
        users: Types.ObjectId[];
        roles: Types.ObjectId[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const TextRoomSchema = new Schema<ITextRoomModel>(
    {
        identifier: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
        // chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        chat: { type: String, default: '' },
        whiteList: {
            users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
        },
    },
    { 
        timestamps: true, 
    },
);

export const TextRoomModel = model<ITextRoomModel>('TextRoom', TextRoomSchema);