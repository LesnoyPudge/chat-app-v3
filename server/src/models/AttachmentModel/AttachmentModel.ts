import { Schema, model, Types, Document } from 'mongoose';



export interface IAttachmentModel extends Document<Types.ObjectId> {
    type: string;
    filename: string;
    size: number;
    extension: string;
    base64string: string;
    createdAt: Date;
    updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachmentModel>(
    {
        type: { type: String, required: true },
        filename: { type: String, required: true },
        size: { type: Number, required: true },
        extension: { type: String, required: true },
        base64string: { type: String, required: true },
    },
    { 
        timestamps: true, 
    },
);

export const AttachmentModel = model<IAttachmentModel>('IAttachment', AttachmentSchema, 'Attachment');