import { MessageDto, PrivateChannelDto, RoomDto } from '@dtos';
import { MessageModel } from '@models';
import { AuthorizedServiceType, ICreateMessageRequest, IDeleteAttachmentMessageRequest, IDeleteMessageRequest, IGetOneMessageRequest, IMessage, IRestoreMessageRequest, IUpdateMessageRequest } from '@types';
import { ApiError, transactionContainer } from '@utils';
import { RoomServiceHelpers, PrivateChannelServiceHelpers, FileServiceHelpers } from '@services';
import { subscription } from '@subscription';



interface IMessageService {
    create: AuthorizedServiceType<ICreateMessageRequest, IMessage>;
    getOne: AuthorizedServiceType<IGetOneMessageRequest, IMessage>;
    update: AuthorizedServiceType<IUpdateMessageRequest, IMessage>;
    delete: AuthorizedServiceType<IDeleteMessageRequest, IMessage>;
    restore: AuthorizedServiceType<IRestoreMessageRequest, IMessage>;
    deleteAttachment: AuthorizedServiceType<IDeleteAttachmentMessageRequest, IMessage>;
}

export const MessageService: IMessageService = {
    async create({ userId, chatId, content = '', attachments, respondOn }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const message = new MessageModel({
                    user: userId,
                    chat: chatId,
                    content,
                    respondOn,
                });

                message.attachments = [];

                if (attachments.length) {
                    await Promise.all(attachments.map(async(atttachment) => {
                        const { id } = await FileServiceHelpers.create({
                            base64url: atttachment.base64url,
                            filename: atttachment.filename,
                            type: 'attachment',
                        });

                        message.attachments.push(id);
                    }));
                }

                await message.save(queryOptions());
                
                const isPrivate = PrivateChannelServiceHelpers.isExist({ filter: { 'chat._id': chatId } });
                
                if (isPrivate) await PrivateChannelServiceHelpers.addMessage({ chatId, messageId: message._id });
                if (!isPrivate) await RoomServiceHelpers.addMessage({ chatId, messageId: message._id });

                return MessageDto.objectFromModel(message);
            },
        );
    },

    async getOne({ userId, messageId }) {
        const message = await MessageModel.findById(messageId, {}, { lean: true });
        return MessageDto.objectFromModel(message);
    },

    async update({ userId, messageId, content = '' }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedMessage = await MessageModel.findByIdAndUpdate(
                    messageId,
                    { $set: { content, isChanged: true } },
                    queryOptions({ new: true }),
                );

                const updatedMessageDto = MessageDto.objectFromModel(updatedMessage);

                onCommit(() => {
                    subscription.messages.update({ entity: updatedMessageDto });
                });

                return updatedMessageDto;
            },
        );
    },

    async delete({ userId, messageId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const deletedMessage = await MessageModel.findByIdAndUpdate(
                    messageId, 
                    { isDeleted: true },
                    queryOptions({ new: true }),
                );
 
                const deletedMessageDto = MessageDto.objectFromModel(deletedMessage);

                onCommit(() => {
                    subscription.messages.update({ entity: deletedMessageDto });
                });

                return deletedMessageDto;
            },
        );
    },

    async restore({ userId, messageId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const restoredMessage = await MessageModel.findByIdAndUpdate(
                    messageId, 
                    { isDeleted: false },
                    queryOptions({ new: true }),
                );
 
                const restoredMessageDto = MessageDto.objectFromModel(restoredMessage);

                onCommit(() => {
                    subscription.messages.update({ entity: restoredMessageDto });
                });

                return restoredMessageDto;
            },
        );
    },

    async deleteAttachment({ attachmentId, messageId, userId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedMessage = await MessageModel.findByIdAndUpdate(
                    messageId,
                    { 
                        $set: { isChanged: true },
                        $pull: { attachments: attachmentId }, 
                    },
                    queryOptions({ new: true }),
                );

                const updatedMessageDto = MessageDto.objectFromModel(updatedMessage);

                onCommit(() => {
                    subscription.messages.update({ entity: updatedMessageDto });
                });

                return updatedMessageDto;
            },
        );
    },
};