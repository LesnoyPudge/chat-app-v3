import { MessageService } from '@services';
import { AuthorizedControllerType, ICreateMessageRequest, IDeleteMessageRequest, IGetManyMessagesRequest, IGetOneMessageRequest, IMessage, IRestoreMessageRequest, IUpdateMessageRequest } from '@types';



interface IMessageController {
    create: AuthorizedControllerType<ICreateMessageRequest, never, IMessage>;
    getOne: AuthorizedControllerType<IGetOneMessageRequest, never, IMessage>;
    getMany: AuthorizedControllerType<IGetManyMessagesRequest, never, IMessage[]>;
    update: AuthorizedControllerType<IUpdateMessageRequest, never, IMessage>;
    delete: AuthorizedControllerType<IDeleteMessageRequest, never, IMessage>;
    restore: AuthorizedControllerType<IRestoreMessageRequest, never, IMessage>;
}

export const MessageController: IMessageController = {
    async create(req, res) {
        const { chatId, attachedImages, content, respondOn } = req.body;
        const { id } = req.auth.user;
        
        const message = await MessageService.create({ userId: id, chatId, attachedImages, content, respondOn });

        res.json(message);
    },
    
    async getOne(req, res) {
        const { messageId } = req.body;
        const { id } = req.auth.user;

        const Message = await MessageService.getOne({ userId: id, messageId });

        res.json(Message);
    },

    async getMany(req, res) {
        const { messageIds } = req.body;
        const { id } = req.auth.user;

        const messages = await MessageService.getMany({ userId: id, messageIds });

        res.json(messages);
    },

    async update(req, res) {
        const { messageId, newValues } = req.body;
        const { id } = req.auth.user;
        
        const updatedMessage = await MessageService.update({ userId: id, messageId, newValues });

        res.json(updatedMessage);
    },

    async delete(req, res) {
        const { messageId } = req.body;
        const { id } = req.auth.user;
        
        const deletedMessage = await MessageService.delete({ userId: id, messageId });

        res.json(deletedMessage);
    },

    async restore(req, res) {
        const { messageId } = req.body;
        const { id } = req.auth.user;

        const restoredMessage = await MessageService.restore({ userId: id, messageId });

        res.json(restoredMessage);
    },
};