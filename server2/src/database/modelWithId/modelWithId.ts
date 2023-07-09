import { WithId } from '@shared';
import mongoose, { Document } from 'mongoose';



export const modelWithId = <T>(model: T) => {
    (model as Document<T>).id = ((model as Document<T>)._id as mongoose.Types.ObjectId)?.toString();
    return model as T & WithId;
};