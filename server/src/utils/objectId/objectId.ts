import { Types } from 'mongoose';



export const objectId = {
    // isObjectId(id: string | Types.ObjectId) {
    //     return id instanceof Types.ObjectId;
    // },
    
    toObjectId(id: string | Types.ObjectId) {
        if (id instanceof Types.ObjectId) return id;
        return new Types.ObjectId(id);
    },
};