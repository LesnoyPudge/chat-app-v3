import { ChatModel } from '@database';
import { ApiError } from '@errors';
import { Endpoints } from '@shared';
import { AuthorizedService } from '@types';



interface ChatService {
    [Endpoints.V1.Chat.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.Chat.GetOne.RequestBody,
        Endpoints.V1.Chat.GetOne.Response
    >;
}

export const ChatService: ChatService = {
    async getOne(_, { chatId }) {
        const chat = await ChatModel.findOne({ id: chatId }).lean();
        if (!chat) throw ApiError.internal();

        return chat;
    },
};