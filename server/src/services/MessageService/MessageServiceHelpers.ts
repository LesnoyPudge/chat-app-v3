import { MessageModel } from '@models';
import { transactionContainer } from '@utils';
import { Types } from 'mongoose';



export const MessageServiceHelpers = {
    async deleteManyByChatId({ chatId }: {chatId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions }) => {
                await MessageModel.deleteMany({ chat: chatId }, queryOptions());
            },
        );
    },
};