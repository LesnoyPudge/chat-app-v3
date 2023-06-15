import { Router } from 'express';
import { ChatController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { ChatValidator } from '@validators';
import { Endpoints } from '@shared';



export const ChatRouter = Router();

ChatRouter.get(
    Endpoints.V1.Chat.GetOne.Path,
    ChatValidator[Endpoints.V1.Chat.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChatController[Endpoints.V1.Chat.GetOne.ActionName],
    ),
);