import { Router } from 'express';
import { ChatController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { ChatValidator } from '@validators';
import { Endpoints } from '@shared';



export const ChatRouter = Router();

ChatRouter[Endpoints.V1.Chat.GetOne.Method](
    Endpoints.V1.Chat.GetOne.Path,
    authorizationMiddleware,
    ChatValidator[Endpoints.V1.Chat.GetOne.ActionName],
    errorCatcherMiddleware(
        ChatController[Endpoints.V1.Chat.GetOne.ActionName],
    ),
);