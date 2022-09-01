import { IMessageModel, MessageModel } from '@models';
import { subscription } from '@subscription';
import { transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';



export const MessageServiceHelpers = {
    async deleteManyByChatId({ chatId }: {chatId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const messagesToDelete = await MessageModel.find({ chat: chatId }, '_id');

                await Promise.all(messagesToDelete.map(async(message) => {
                    await message.delete(queryOptions());

                    onCommit(() => {
                        subscription.messages.delete({ entityId: message._id.toString() });
                    });
                }));
            },
        );
    },

    async getOne(filter: FilterQuery<IMessageModel>) {
        const message = await MessageModel.findOne(filter, {}, { lean: true });
        return message;
    },

    async isExist(filter: FilterQuery<IMessageModel>) {
        const isExist = !!await MessageModel.exists(filter);
        return isExist;
    },
};