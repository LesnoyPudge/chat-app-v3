import { TextRoomDto } from '@dtos';
import { TextRoomModel } from '@models';
import { subscription } from '@subscription';
import { objectId, transactionContainer } from '@utils';
import { Types } from 'mongoose';
import { MessageServiceHelpers } from '../MessageService';



const { toObjectId } = objectId;

export const TextRoomServiceHelpers = {
    async createDefaultTextRoom({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const textRoom = await TextRoomModel.create([{
                    channel: toObjectId(channelId),
                    identifier: 'main',
                    name: 'Text room',
                }], queryOptions()).then((textRooms) => textRooms[0]);

                return textRoom;
            },
        );
    },

    async deleteManyByChannelId({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const textRoomsToDelete = await TextRoomModel.find({ channel: channelId });

                await Promise.all(
                    textRoomsToDelete.map(async(textRoom) => {
                        await textRoom.delete(queryOptions());
                        if (textRoom.chat.messages.length === 0) return; 
                        
                        await MessageServiceHelpers.deleteManyByChatId({ chatId: textRoom.chat._id });
                    }),
                );
            },
        );
    },

    async addMessage({ chatId, messageId }: {chatId: string | Types.ObjectId, messageId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedTextRoom = await TextRoomModel.findOneAndUpdate(
                    { 'chat._id': chatId }, 
                    { $push: { 'chat.messages': toObjectId(messageId) } }, 
                    queryOptions(),
                );

                onCommit(() => {
                    subscription.textRooms.update({ entity: TextRoomDto.objectFromModel(updatedTextRoom) });
                });

                return updatedTextRoom;
            },
        );
    },
};