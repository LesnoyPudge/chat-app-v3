import { Schema, model, Types, Document } from 'mongoose';



export interface IAttachmentModel extends Document<Types.ObjectId> {
    identifier: string;
    filename: string;
    base64url: string;
    createdAt: Date;
    updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachmentModel>(
    {
        identifier: { type: String, default: '' },
        filename: { type: String, required: true },
        base64url: { type: String, required: true },
    },
    { 
        timestamps: true, 
    },
);

export const AttachmentModel = model<IAttachmentModel>('IAttachment', AttachmentSchema, 'Attachment');