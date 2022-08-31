import { RoomDto } from '@dtos';
import { RoomModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { Types } from 'mongoose';
import { MessageServiceHelpers } from '../MessageService';



const { toObjectId } = objectId;

export const RoomServiceHelpers = {
    async createDefaultRoom({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const room = await RoomModel.create([{
                    channel: toObjectId(channelId),
                    identifier: 'main',
                    name: 'Text room',
                }], queryOptions()).then((rooms) => rooms[0]);

                return room;
            },
        );
    },

    async deleteManyByChannelId({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const roomsToDelete = await RoomModel.find({ channel: channelId });

                await Promise.all(
                    roomsToDelete.map(async(room) => {
                        await room.delete(queryOptions());
                        if (room.chat.messages.length === 0) return; 
                        
                        await MessageServiceHelpers.deleteManyByChatId({ chatId: room.chat._id });
                    }),
                );
            },
        );
    },

    async addMessage({ chatId, messageId }: {chatId: string | Types.ObjectId, messageId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedRoom = await RoomModel.findOneAndUpdate(
                    { 'chat._id': chatId }, 
                    { $push: { 'chat.messages': toObjectId(messageId) } }, 
                    queryOptions(),
                );

                onCommit(() => {
                    subscription.rooms.update({ entity: RoomDto.objectFromModel(updatedRoom) });
                });

                return updatedRoom;
            },
        );
    },
};