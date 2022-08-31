import { Schema, model, Types, Document } from 'mongoose';



export interface IAttachmentModel extends Document<Types.ObjectId> {
    isDefault: boolean;
    filename: string;
    base64url: string;
    createdAt: Date;
    updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachmentModel>(
    {
        isDefault: { type: Boolean, default: false },
        filename: { type: String, required: true },
        base64url: { type: String, required: true },
    },
    { 
        timestamps: true, 
    },
);

export const AttachmentModel = model<IAttachmentModel>('IAttachment', AttachmentSchema, 'Attachment');