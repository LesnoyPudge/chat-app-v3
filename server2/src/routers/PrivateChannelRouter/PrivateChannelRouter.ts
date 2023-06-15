import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { PrivateChannelValidator } from '@validators';
import { Endpoints } from '@shared';



export const PrivateChannelRouter = Router();

PrivateChannelRouter.post(
    Endpoints.V1.PrivateChannel.Create.Path,
    PrivateChannelValidator[Endpoints.V1.PrivateChannel.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        PrivateChannelController[Endpoints.V1.PrivateChannel.Create.ActionName],
    ),
);

PrivateChannelRouter.get(
    Endpoints.V1.PrivateChannel.GetOne.Path,
    PrivateChannelValidator[Endpoints.V1.PrivateChannel.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        PrivateChannelController[Endpoints.V1.PrivateChannel.GetOne.ActionName],
    ),
);