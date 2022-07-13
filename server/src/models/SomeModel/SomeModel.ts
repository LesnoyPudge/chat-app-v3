import { Schema, model, Types } from 'mongoose';



export interface ISomeModel {
    some: string;
    info: string;
}

const SomeSchema = new Schema<ISomeModel>({
    some: { type: String, required: true },
    info: { type: String, required: true },
});

export const SomeModel = model<ISomeModel>('Some', SomeSchema);