import { MessageModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { ChatServiceHelpers, FileServiceHelpers, PrivateChannelServiceHelpers, RoomServiceHelpers } from '@services';
import { Endpoints } from '@shared';
import { MessageSubscription } from '@subscription';
import { AuthorizedService } from '@types';



interface MessageService {
    [Endpoints.V1.Message.Create.ActionName]: AuthorizedService<
        Endpoints.V1.Message.Create.RequestBody,
        Endpoints.V1.Message.Create.Response
    >;
    [Endpoints.V1.Message.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.Message.GetOne.RequestBody,
        Endpoints.V1.Message.GetOne.Response
    >;
    [Endpoints.V1.Message.Update.ActionName]: AuthorizedService<
        Endpoints.V1.Message.Update.RequestBody,
        Endpoints.V1.Message.Update.Response
    >;
    [Endpoints.V1.Message.Delete.ActionName]: AuthorizedService<
        Endpoints.V1.Message.Delete.RequestBody,
        Endpoints.V1.Message.Delete.Response
    >;
    [Endpoints.V1.Message.Restore.ActionName]: AuthorizedService<
        Endpoints.V1.Message.Restore.RequestBody,
        Endpoints.V1.Message.Restore.Response
    >;
    [Endpoints.V1.Message.DeleteAttachment.ActionName]: AuthorizedService<
        Endpoints.V1.Message.DeleteAttachment.RequestBody,
        Endpoints.V1.Message.DeleteAttachment.Response
    >;
}

export const MessageService: MessageService = {
    async create({ id }, { chatId, content = '', attachments = [] }) {
        return transactionContainer(
            async({ session }) => {
                const newMessage = new MessageModel({
                    user: id,
                    chat: chatId,
                    content,
                    attachments: [],
                });

                if (attachments.length) {
                    await Promise.all(attachments.map(async(attachment) => {
                        const { id, name, type, size } = await FileServiceHelpers.create(attachment);
                        
                        newMessage.attachments.push({
                            id,
                            name,
                            size,
                            type,
                        });
                    }));
                }

                await ChatServiceHelpers.addMessage({ id: chatId }, newMessage.id);

                const message = await newMessage.save({ session });

                return message;
            },
        );
    },

    async getOne(_, { messageId }) {
        const message = await MessageModel.findOne({ id: messageId }).lean();

        if (!message) throw ApiError.internal();

        return message;
    },

    async update(_, { messageId, content }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedMessage = await MessageModel.findOneAndUpdate(
                    { id: messageId },
                    { $set: { content, isChanged: true, updatedAt: Date.now() } },
                    { new: true },
                ).session(session).lean();

                if (!updatedMessage) throw ApiError.internal();

                onCommit(() => {
                    MessageSubscription.update(updatedMessage);
                });

                return updatedMessage;
            },
        );
    },

    async delete(_, { messageId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedMessage = await MessageModel.findOneAndUpdate(
                    { id: messageId }, 
                    { isDeleted: true },
                    { new: true },
                ).session(session).lean();

                if (!updatedMessage) throw ApiError.internal();

                onCommit(() => {
                    MessageSubscription.update(updatedMessage);
                });
            },
        );
    },

    async restore(_, { messageId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedMessage = await MessageModel.findOneAndUpdate(
                    { id: messageId }, 
                    { isDeleted: false },
                    { new: true },
                ).session(session).lean();

                if (!updatedMessage) throw ApiError.internal();

                onCommit(() => {
                    MessageSubscription.update(updatedMessage);
                });

                return updatedMessage;
            },
        );
    },

    async deleteAttachment(_, { fileId, messageId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedMessage = await MessageModel.findOneAndUpdate(
                    { id: messageId },
                    { 
                        $set: { isChanged: true, updatedAt: Date.now() },
                        $pull: { attachments: fileId }, 
                    },
                    { new: true },
                ).session(session).lean();

                if (!updatedMessage) throw ApiError.internal();
                
                onCommit(() => {
                    MessageSubscription.update(updatedMessage);
                });

                return updatedMessage;
            },
        );
    },
};