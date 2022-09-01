import { Router } from 'express';
import { MessageController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { MessageValidator } from '@validators';




const { CUSTOM_API_V1_URL } = getEnv();

export const MessageRouter = Router();

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/create',
    authorizationMiddleware,
    MessageValidator.create,
    controllerContainer(MessageController.create),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/:messageId',
    authorizationMiddleware,
    MessageValidator.getOne,
    controllerContainer(MessageController.getOne),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/:messageId/update',
    authorizationMiddleware,
    MessageValidator.update,
    controllerContainer(MessageController.update),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/:messageId/delete',
    authorizationMiddleware,
    MessageValidator.delete,
    controllerContainer(MessageController.delete),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/:messageId/restore',
    authorizationMiddleware,
    MessageValidator.restore,
    controllerContainer(MessageController.restore),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + 'chat/:chatId/messages/:messageId/attachment/:attachmentId/delete',
    authorizationMiddleware,
    MessageValidator.deleteAttachment,
    controllerContainer(MessageController.deleteAttachment),
);