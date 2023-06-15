import { PrivateChannelModel } from '@database';
import { FilterQuery } from 'mongoose';
import { Entities } from '@shared';



export const PrivateChannelServiceHelpers = {
    async isExist(filter: FilterQuery<Entities.PrivateChannel.Default>) {
        return !!await PrivateChannelModel.exists(filter).lean(); 
    },

    async getOne(filter: FilterQuery<Entities.PrivateChannel.Default>) {
        return await PrivateChannelModel.findOne(filter).lean();
    },
};