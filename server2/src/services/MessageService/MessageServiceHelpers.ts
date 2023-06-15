import { MessageModel, transactionContainer } from '@database';
import { Entities, WithChatId } from '@shared';
import { MessageSubscription } from '@subscription';
import { FilterQuery } from 'mongoose';



export const MessageServiceHelpers = {
    async deleteManyByChatId({ chatId }: WithChatId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const messagesToDelete = await MessageModel.find({ chat: chatId });

                await Promise.all(messagesToDelete.map(async(message) => {
                    await message.deleteOne({ session });

                    onCommit(() => {
                        MessageSubscription.delete(message.id);
                    });
                }));
            },
        );
    },

    async getOne(filter: FilterQuery<Entities.Message.Default>) {
        return await MessageModel.findOne(filter).lean();
    },

    async isExist(filter: FilterQuery<Entities.Message.Default>) {
        return !!await MessageModel.exists(filter).lean();
    },
};