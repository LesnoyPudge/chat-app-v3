import { ChatModel, transactionContainer } from '@database';
import { ApiError } from '@errors';
import { Entities, Id } from '@shared';
import { ChatSubscription } from '@subscription';
import { FilterQuery } from 'mongoose';



export const ChatServiceHelpers = {
    async create({ room, privateChannel }: Entities.Chat.WithOneId) {
        return transactionContainer(
            async({ session }) => {
                const chat = ChatModel.create([{
                    privateChannel,
                    room,
                    messages: [],
                }], { session }).then((v) => v[0]);

                return chat;
            },
        );
    },

    async getOne(filter: FilterQuery<Entities.Chat.Default>) {
        const chat = await ChatModel.findOne(filter).lean();
        return chat;
    },

    async addMessage(filter: FilterQuery<Entities.Chat.Default>, messageId: Id) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedChat = await ChatModel.findOneAndUpdate(
                    filter,
                    { $push: { messages: messageId } },
                ).session(session).lean();

                if (!updatedChat) throw ApiError.internal();

                onCommit(() => {
                    ChatSubscription.update(updatedChat);
                });

                return updatedChat;
            },
        );
    },

    async isExist(filter: FilterQuery<Entities.Chat.Default>) {
        return !!await ChatModel.exists(filter).lean();
    },
};