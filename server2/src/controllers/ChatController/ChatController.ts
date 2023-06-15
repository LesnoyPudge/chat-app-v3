import { ChatService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface ChatController {
    [Endpoints.V1.Chat.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Chat.GetOne.RequestBody,
        Endpoints.V1.Chat.GetOne.Response
    >;
}

export const ChatController: ChatController = {    
    async getOne(req, res) {
        const chat = await ChatService.getOne(req.auth, req.body);
        res.json(chat);
    },
};