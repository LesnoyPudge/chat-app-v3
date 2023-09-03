import { RoomModel, modelWithId, transactionContainer } from '@database';
import { ChatServiceHelpers, MessageServiceHelpers } from '@services';
import { Entities, WithChannelId } from '@shared';
import { RoomSubscription } from '@subscription';
import { FilterQuery } from 'mongoose';



export const RoomServiceHelpers = {
    async createDefaultRoom({ channelId }: WithChannelId) {
        return transactionContainer(
            async({ session }) => {
                const room = modelWithId(new RoomModel({
                    channel: channelId,
                    name: 'Text room',
                }));

                const chat = await ChatServiceHelpers.create({ owner: 'Room', ownerId: room.id });

                room.chat = chat.id;

                const savedRoom = await room.save({ session });

                return savedRoom;
            },
        );
    },

    async deleteManyByChannelId({ channelId }: WithChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const roomsToDelete = await RoomModel.find({ channel: channelId });

                await Promise.all(
                    roomsToDelete.map(async(room) => {
                        await room.deleteOne({ session });
                        await MessageServiceHelpers.deleteManyByChatId({ chatId: room.chat });

                        onCommit(() => {
                            RoomSubscription.delete(room.id);
                        });
                    }),
                );
            },
        );
    },

    async getOne(filter: FilterQuery<Entities.Room.Default>) {
        return await RoomModel.findOne(filter).lean();
    },

    async isExist(filter: FilterQuery<Entities.Room.Default>) {
        return !!await RoomModel.exists(filter).lean();
    },

    async getMany(filter: FilterQuery<Entities.Room.Default>) {
        return await RoomModel.find(filter).lean();
    },
};