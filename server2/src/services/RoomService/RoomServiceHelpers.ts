import { RoomModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { MessageServiceHelpers } from '@services';
import { Entities, WithChannelId, WithChatId, WithMessageId } from '@shared';
import { RoomSubscription } from '@subscription';
import { FilterQuery } from 'mongoose';



export const RoomServiceHelpers = {
    async createDefaultRoom({ channelId }: WithChannelId) {
        return transactionContainer(
            async({ session }) => {
                const room = await RoomModel.create([{
                    channel: channelId,
                    name: 'Text room',
                }], { session }).then((v) => v[0]);

                return room;
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
};