import { MessageDto } from '@dtos';
import { MessageModel, UserModel } from '@models';
import { AuthorizedServiceType, ICreateMessageRequest, IDeleteMessageRequest, IGetManyMessagesRequest, IGetOneMessageRequest, IMessage, IUpdateMessageRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';



interface IMessageService {
    create: AuthorizedServiceType<ICreateMessageRequest, IMessage>;
    getOne: AuthorizedServiceType<IGetOneMessageRequest, IMessage>;
    getMany: AuthorizedServiceType<IGetManyMessagesRequest, IMessage[]>;
    update: AuthorizedServiceType<IUpdateMessageRequest, IMessage>;
    delete: AuthorizedServiceType<IDeleteMessageRequest, IMessage>;
}

export const MessageService: IMessageService = {
    async create({ userId, chatId, content = '', attachedImages = [] }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const message = await MessageModel.create(
                    [{
                        user: userId,
                        chat: chatId,
                        content,
                        attachedImages,
                    }],
                    queryOptions(),
                ).then((messages) => messages[0]);
                
                const messageDto = MessageDto.objectFromModel(message);
                return messageDto;
            },
        );
    },

    async getOne({ userId, messageId }) {
        const message = await MessageModel.findById(messageId, {}, { lean: true });
        if (!message) throw ApiError.badRequest('Сообщение не найдено не найден');

        const messageDto = MessageDto.objectFromModel(message);
        return messageDto;
    },

    async getMany({ userId, messageIds }) {
        const messages = await MessageModel.find({ _id: { $in: messageIds } }, {}, { lean: true });
        if (!messages.length) {
            throw ApiError.badRequest('Сообщения не найдены');
        }

        const messageDtos = messages.map((message) => {
            return MessageDto.objectFromModel(message);
        });

        return messageDtos;
    },

    async update({ userId, messageId, newValues }) {
        return await transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedMessage = await MessageModel.findByIdAndUpdate(
                    messageId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedMessage) throw ApiError.badRequest('Не удалось обновить канал');

                const updatedMessageDto = MessageDto.objectFromModel(updatedMessage);

                onCommit(() => {
                    // MessageSubscription.update({ userId, message: updatedMessageDto });
                });

                return updatedMessageDto;
            },
        );
    },

    async delete({ userId, messageId }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const deletedMessage = await MessageModel.findByIdAndDelete(messageId, queryOptions());
                if (!deletedMessage) {
                    throw ApiError.badRequest('Не удалось удалить канал');
                }

                await UserModel.updateMany(
                    { messages: messageId }, 
                    { $pull: { messages: messageId } }, 
                    queryOptions(),
                );
 
                const deletedMessageDto = MessageDto.objectFromModel(deletedMessage);
                return deletedMessageDto;
            },
        );
    },
};