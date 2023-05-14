import { Document, Schema } from 'mongoose';



export const withPreSaveHook = <T>(schema: T) => {
    (schema as Schema<T & Document>).pre('save', function(next) {
        this.id = this._id.toString();

        next();
    });

    return schema as T;
};