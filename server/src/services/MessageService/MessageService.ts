import { MessageDto } from '@dtos';
import { MessageModel } from '@models';
import { AuthorizedServiceType, ICreateMessageRequest, IDeleteMessageRequest, IGetManyMessagesRequest, IGetOneMessageRequest, IMessage, IRestoreMessageRequest, IUpdateMessageRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { TextRoomServiceHelpers, PrivateChannelServiceHelpers } from '@services';



interface IMessageService {
    create: AuthorizedServiceType<ICreateMessageRequest, IMessage>;
    getOne: AuthorizedServiceType<IGetOneMessageRequest, IMessage>;
    getMany: AuthorizedServiceType<IGetManyMessagesRequest, IMessage[]>;
    update: AuthorizedServiceType<IUpdateMessageRequest, IMessage>;
    delete: AuthorizedServiceType<IDeleteMessageRequest, IMessage>;
    restore: AuthorizedServiceType<IRestoreMessageRequest, IMessage>;
}

export const MessageService: IMessageService = {
    async create({ userId, chatId, content = '', atttachments = [], respondOn = [] }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const message = await MessageModel.create(
                    [{
                        user: userId,
                        chat: chatId,
                        content,
                        atttachments,
                        respondOn,
                    }],
                    queryOptions(),
                ).then((messages) => messages[0]);
                
                const isPrivate = PrivateChannelServiceHelpers.isExist({ filter: { 'chat._id': chatId } });
                
                if (isPrivate) await PrivateChannelServiceHelpers.addMessage({ chatId, messageId: message._id });
                if (!isPrivate) await TextRoomServiceHelpers.addMessage({ chatId, messageId: message._id });

                const messageDto = MessageDto.objectFromModel(message);
                return messageDto;
            },
        );
    },

    async getOne({ userId, messageId }) {
        const message = await MessageModel.findById(messageId, {}, { lean: true });
        if (!message) throw ApiError.badRequest('Сообщение не найдено');

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
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedMessage = await MessageModel.findByIdAndUpdate(
                    messageId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedMessage) throw ApiError.badRequest('Не удалось обновить сообщение');

                const updatedMessageDto = MessageDto.objectFromModel(updatedMessage);

                onCommit(() => {
                    // MessageSubscription.update({ userId, message: updatedMessageDto });
                });

                return updatedMessageDto;
            },
        );
    },

    async delete({ userId, messageId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const deletedMessage = await MessageModel.findByIdAndUpdate(
                    messageId, 
                    { isDeleted: true },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось удалить сообщение');
                });
 
                const deletedMessageDto = MessageDto.objectFromModel(deletedMessage);
                return deletedMessageDto;
            },
        );
    },

    async restore({ userId, messageId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const restoredMessage = await MessageModel.findByIdAndUpdate(
                    messageId, 
                    { isDeleted: false },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось восстановить сообщение');
                });
 
                const restoredMessageDto = MessageDto.objectFromModel(restoredMessage);
                return restoredMessageDto;
            },
        );
    },
};