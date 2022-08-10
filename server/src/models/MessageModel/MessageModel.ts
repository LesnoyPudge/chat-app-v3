import { Schema, model, Types, Document } from 'mongoose';



export interface IMessageModel extends Document<Types.ObjectId> {
    chat: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    attachedImages: string[];
    isChanged: boolean;
    isDeleted: boolean;
    respondOn: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessageModel>(
    {
        chat: { type: Schema.Types.ObjectId, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        attachedImages: [{ type: String }],
        isChanged: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        respondOn: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    },
    { 
        timestamps: true, 
    },
);

export const MessageModel = model<IMessageModel>('Message', MessageSchema);