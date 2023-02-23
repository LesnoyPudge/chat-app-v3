import { MessageService } from '@services';
import { AuthorizedControllerType, ICreateMessageRequest, IDeleteAttachmentMessageRequest, IDeleteMessageRequest, IGetManyMessagesRequest, IGetOneMessageRequest, IMessage, IRestoreMessageRequest, IUpdateMessageRequest } from '@types';



interface IMessageController {
    create: AuthorizedControllerType<ICreateMessageRequest, never, IMessage>;
    getOne: AuthorizedControllerType<IGetOneMessageRequest, never, IMessage>;
    update: AuthorizedControllerType<IUpdateMessageRequest, never, IMessage>;
    delete: AuthorizedControllerType<IDeleteMessageRequest, never, IMessage>;
    restore: AuthorizedControllerType<IRestoreMessageRequest, never, IMessage>;
    deleteAttachment: AuthorizedControllerType<IDeleteAttachmentMessageRequest, never, IMessage>;
}

export const MessageController: IMessageController = {
    async create(req, res) {
        const { chatId, attachments, content, respondOn } = req.body;
        const { id } = req.auth.user;
        
        const message = await MessageService.create({ userId: id, chatId, attachments, content, respondOn });

        res.json(message);
    },
    
    async getOne(req, res) {
        const { messageId } = req.body;
        const { id } = req.auth.user;

        const Message = await MessageService.getOne({ userId: id, messageId });

        res.json(Message);
    },

    async update(req, res) {
        const { messageId, content } = req.body;
        const { id } = req.auth.user;
        
        const updatedMessage = await MessageService.update({ userId: id, messageId, content });

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

    async deleteAttachment(req, res) {
        const { attachmentId, messageId } = req.body;
        const { id } = req.auth.user;

        const updatedMessage = await MessageService.deleteAttachment({ userId: id, attachmentId, messageId });
        
        res.json(updatedMessage);
    },
};