import { Router } from 'express';
import { MessageController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { MessageValidator } from '@validators';
import { Endpoints } from '@shared';



export const MessageRouter = Router();

MessageRouter.post(
    Endpoints.V1.Message.Create.Path,
    MessageValidator[Endpoints.V1.Message.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Create.ActionName],
    ),
);

MessageRouter.post(
    Endpoints.V1.Message.Delete.Path,
    MessageValidator[Endpoints.V1.Message.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Delete.ActionName],
    ),
);

MessageRouter.post(
    Endpoints.V1.Message.DeleteAttachment.Path,
    MessageValidator[Endpoints.V1.Message.DeleteAttachment.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.DeleteAttachment.ActionName],
    ),
);

MessageRouter.get(
    Endpoints.V1.Message.GetOne.Path,
    MessageValidator[Endpoints.V1.Message.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.GetOne.ActionName],
    ),
);

MessageRouter.post(
    Endpoints.V1.Message.Restore.Path,
    MessageValidator[Endpoints.V1.Message.Restore.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Restore.ActionName],
    ),
);

MessageRouter.post(
    Endpoints.V1.Message.Update.Path,
    MessageValidator[Endpoints.V1.Message.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Update.ActionName],
    ),
);