import { Schema, model, Types, Document } from 'mongoose';



export interface IFileModel extends Document<Types.ObjectId> {
    isDefault: boolean;
    type: 'avatar' | 'attachment' | 'roleImage';
    filename: string;
    base64url: string;
    createdAt: Date;
    updatedAt: Date;
}

const FileSchema = new Schema<IFileModel>(
    {
        isDefault: { type: Boolean, default: false },
        type: { type: String, required: true },
        filename: { type: String, required: true },
        base64url: { type: String, required: true },
    },
    { 
        timestamps: true, 
    },
);

export const FileModel = model<IFileModel>('IFile', FileSchema, 'File');