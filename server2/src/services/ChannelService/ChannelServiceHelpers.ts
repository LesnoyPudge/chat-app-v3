import { ChannelModel, transactionContainer } from '@database';
import { FilterQuery } from 'mongoose';
import { Entities, WithChannelId, WithRoleId, WithRoomId } from '@shared';
import { ApiError } from '@errors';
import { ChannelSubscription } from '@subscription';



export const ChannelServiceHelpers = {
    async addRoom({ channelId, roomId }: WithChannelId & WithRoomId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId },
                    { $push: { rooms: roomId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async removeRoom({ roomId }: WithRoomId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { rooms: roomId },
                    { $pull: { rooms: roomId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async addRole({ channelId, roleId }: WithChannelId & WithRoleId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { id: channelId },
                    { $push: { roles: roleId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async removeRole({ roleId }: WithRoleId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChannel = await ChannelModel.findOneAndUpdate(
                    { roles: roleId },
                    { $pull: { roles: roleId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedChannel) throw ApiError.internal();

                onCommit(() => {
                    ChannelSubscription.update(updatedChannel);
                });

                return updatedChannel;
            },
        );
    },

    async isChannelsExists(filter: FilterQuery<Entities.Channel.Default>) {
        return await ChannelModel.find(filter, 'id').lean();
    },

    async getOne(filter: FilterQuery<Entities.Channel.Default>) {
        return await ChannelModel.findOne(filter).lean();
    },

    async isExist(filter: FilterQuery<Entities.Channel.Default>) {
        return !!await ChannelModel.exists(filter);
    },
};