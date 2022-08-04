import { Schema, model, Types, Document } from 'mongoose';



export interface IMessageModel extends Document<Types.ObjectId> {
    textRoom: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    attachedImages: string[];
    isChanged: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessageModel>(
    {
        textRoom: { type: Schema.Types.ObjectId, ref: 'TextRoom', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, default: '' },
        attachedImages: [{ type: String }],
        isChanged: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    { 
        timestamps: true, 
    },
);

export const MessageModel = model<IMessageModel>('Message', MessageSchema);