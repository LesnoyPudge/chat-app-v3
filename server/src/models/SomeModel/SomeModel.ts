import {Schema, model, Types, pluralize} from 'mongoose';



export interface ISomeModel {
    some: string;
    info: string;
}

pluralize(null);

const SomeSchema = new Schema<ISomeModel>({
    some: {type: String, required: true},
    info: {type: String, required: true},
});

export const SomeModel = model<ISomeModel>('Some', SomeSchema);