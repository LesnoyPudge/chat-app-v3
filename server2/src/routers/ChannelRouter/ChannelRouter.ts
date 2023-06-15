import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { ChannelValidator } from '@validators';
import { Endpoints } from '@shared';



export const ChannelRouter = Router();

ChannelRouter.post(
    Endpoints.V1.Channel.AcceptInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Ban.Path,
    ChannelValidator[Endpoints.V1.Channel.Ban.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Ban.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Create.Path,
    ChannelValidator[Endpoints.V1.Channel.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Create.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.CreateInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.CreateInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.CreateInvitation.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Delete.Path,
    ChannelValidator[Endpoints.V1.Channel.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Delete.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.DeleteInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    ),
);

ChannelRouter.get(
    Endpoints.V1.Channel.GetOne.Path,
    ChannelValidator[Endpoints.V1.Channel.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.GetOne.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Kick.Path,
    ChannelValidator[Endpoints.V1.Channel.Kick.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Kick.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Leave.Path,
    ChannelValidator[Endpoints.V1.Channel.Leave.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Leave.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Unban.Path,
    ChannelValidator[Endpoints.V1.Channel.Unban.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Unban.ActionName],
    ),
);

ChannelRouter.post(
    Endpoints.V1.Channel.Update.Path,
    ChannelValidator[Endpoints.V1.Channel.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Update.ActionName],
    ),
);