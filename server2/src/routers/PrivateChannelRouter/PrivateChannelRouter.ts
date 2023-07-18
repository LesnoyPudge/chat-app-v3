import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { PrivateChannelValidator } from '@validators';
import { Endpoints } from '@shared';



export const PrivateChannelRouter = Router();

PrivateChannelRouter[Endpoints.V1.PrivateChannel.Create.Method](
    Endpoints.V1.PrivateChannel.Create.Path,
    authorizationMiddleware,
    PrivateChannelValidator[Endpoints.V1.PrivateChannel.Create.ActionName],
    errorCatcherMiddleware(
        PrivateChannelController[Endpoints.V1.PrivateChannel.Create.ActionName],
    ),
);

PrivateChannelRouter[Endpoints.V1.PrivateChannel.GetOne.Method](
    Endpoints.V1.PrivateChannel.GetOne.Path,
    authorizationMiddleware,
    PrivateChannelValidator[Endpoints.V1.PrivateChannel.GetOne.ActionName],
    errorCatcherMiddleware(
        PrivateChannelController[Endpoints.V1.PrivateChannel.GetOne.ActionName],
    ),
);