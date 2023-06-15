import { MessageService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';



interface MessageController {
    [Endpoints.V1.Message.Create.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.Create.RequestBody,
        Endpoints.V1.Message.Create.Response
    >;
    [Endpoints.V1.Message.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.GetOne.RequestBody,
        Endpoints.V1.Message.GetOne.Response
    >;
    [Endpoints.V1.Message.Update.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.Update.RequestBody,
        Endpoints.V1.Message.Update.Response
    >;
    [Endpoints.V1.Message.Delete.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.Delete.RequestBody,
        Endpoints.V1.Message.Delete.Response
    >;
    [Endpoints.V1.Message.Restore.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.Restore.RequestBody,
        Endpoints.V1.Message.Restore.Response
    >;
    [Endpoints.V1.Message.DeleteAttachment.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Message.DeleteAttachment.RequestBody,
        Endpoints.V1.Message.DeleteAttachment.Response
    >;
}

export const MessageController: MessageController = {
    async create(req, res) {
        const message = await MessageService.create(req.auth, req.body);
        res.json(message);
    },
    
    async getOne(req, res) {
        const message = await MessageService.getOne(req.auth, req.body);
        res.json(message);
    },

    async update(req, res) {
        const message = await MessageService.update(req.auth, req.body);
        res.json(message);
    },

    async delete(req, res) {
        const message = await MessageService.delete(req.auth, req.body);
        res.json(message);
    },

    async restore(req, res) {
        const message = await MessageService.restore(req.auth, req.body);
        res.json(message);
    },

    async deleteAttachment(req, res) {
        const message = await MessageService.deleteAttachment(req.auth, req.body);
        res.json(message);
    },
};