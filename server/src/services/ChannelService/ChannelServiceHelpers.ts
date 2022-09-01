import { ChannelDto } from '@dtos';
import { ChannelModel, IChannelModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';



const { toObjectId } = objectId;

export const ChannelServiceHelpers = {
    async addRoom({ channelId, roomId }: 
        {
            channelId: string | Types.ObjectId, 
            roomId: string | Types.ObjectId
        },
    ) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    { $push: { rooms: toObjectId(roomId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async removeRoom({ roomId }: { roomId: string | Types.ObjectId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { rooms: roomId }, 
                    { $pull: { rooms: roomId } }, 
                    queryOptions({ new: true }),
                );
                
                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async addRole({ channelId, roleId }: {channelId: string | Types.ObjectId, roleId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId,
                    { $push: { roles: toObjectId(roleId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async removeRole({ roleId }: {roleId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { roles: roleId },
                    { $pull: { roles: toObjectId(roleId) } }, 
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.channels.update({ entity: ChannelDto.objectFromModel(updatedChannel) });
                });

                return updatedChannel;
            },
        );
    },

    async isChannelExist(filter: FilterQuery<IChannelModel>) {
        return !!await ChannelModel.exists(filter);
    },

    async isChannelsExists(filter: FilterQuery<IChannelModel>) {
        return await ChannelModel.find(filter, '_id', { lean: true });
    },

    async getOne(filter: FilterQuery<IChannelModel>) {
        return await ChannelModel.findOne(filter, {}, { lean: true });
    },

    async isExist(filter: FilterQuery<IChannelModel>) {
        return !!await ChannelModel.exists(filter);
    },

};