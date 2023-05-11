import mongoose from 'mongoose';



export const addIdOnSaveHook = <T extends mongoose.Document>(schema: mongoose.Schema<T>) => {
    schema.pre('save', function(next) {
        const oId = this._id.toString();
        if (this.id === oId) return next();
        
        this.id = this._id.toString();
        next();
    });

    return schema;
};