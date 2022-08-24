import { isValidObjectId, Types } from 'mongoose';



export const objectId = {
    isObjectId(id: string | Types.ObjectId) {
        return isValidObjectId(id);
    },

    toObjectId(id: string | Types.ObjectId) {
        if (isValidObjectId(id)) return id as Types.ObjectId;
        return new Types.ObjectId(id);
    },
};