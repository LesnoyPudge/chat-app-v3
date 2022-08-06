import { Types } from 'mongoose';



export const toObjectId = (id: string) => {
    return new Types.ObjectId(id);
};