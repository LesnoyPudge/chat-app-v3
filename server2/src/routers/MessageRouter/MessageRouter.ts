import { Router } from 'express';
import { MessageController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { MessageValidator } from '@validators';
import { Endpoints } from '@shared';



export const MessageRouter = Router();

MessageRouter[Endpoints.V1.Message.Create.Method](
    Endpoints.V1.Message.Create.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.Create.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Create.ActionName],
    ),
);

MessageRouter[Endpoints.V1.Message.Delete.Method](
    Endpoints.V1.Message.Delete.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.Delete.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Delete.ActionName],
    ),
);

MessageRouter[Endpoints.V1.Message.DeleteAttachment.Method](
    Endpoints.V1.Message.DeleteAttachment.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.DeleteAttachment.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.DeleteAttachment.ActionName],
    ),
);

MessageRouter[Endpoints.V1.Message.GetOne.Method](
    Endpoints.V1.Message.GetOne.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.GetOne.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.GetOne.ActionName],
    ),
);

MessageRouter[Endpoints.V1.Message.Restore.Method](
    Endpoints.V1.Message.Restore.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.Restore.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Restore.ActionName],
    ),
);

MessageRouter[Endpoints.V1.Message.Update.Method](
    Endpoints.V1.Message.Update.Path,
    authorizationMiddleware,
    MessageValidator[Endpoints.V1.Message.Update.ActionName],
    errorCatcherMiddleware(
        MessageController[Endpoints.V1.Message.Update.ActionName],
    ),
);