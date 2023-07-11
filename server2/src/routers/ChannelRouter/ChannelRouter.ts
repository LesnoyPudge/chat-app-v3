import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { ChannelValidator } from '@validators';
import { Endpoints } from '@shared';



export const ChannelRouter = Router();

ChannelRouter[Endpoints.V1.Channel.AcceptInvitation.Method](
    Endpoints.V1.Channel.AcceptInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Ban.Method](
    Endpoints.V1.Channel.Ban.Path,
    ChannelValidator[Endpoints.V1.Channel.Ban.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Ban.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Create.Method](
    Endpoints.V1.Channel.Create.Path,
    ChannelValidator[Endpoints.V1.Channel.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Create.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.CreateInvitation.Method](
    Endpoints.V1.Channel.CreateInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.CreateInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.CreateInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Delete.Method](
    Endpoints.V1.Channel.Delete.Path,
    ChannelValidator[Endpoints.V1.Channel.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Delete.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.DeleteInvitation.Method](
    Endpoints.V1.Channel.DeleteInvitation.Path,
    ChannelValidator[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.GetOne.Method](
    Endpoints.V1.Channel.GetOne.Path,
    ChannelValidator[Endpoints.V1.Channel.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.GetOne.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Kick.Method](
    Endpoints.V1.Channel.Kick.Path,
    ChannelValidator[Endpoints.V1.Channel.Kick.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Kick.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Leave.Method](
    Endpoints.V1.Channel.Leave.Path,
    ChannelValidator[Endpoints.V1.Channel.Leave.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Leave.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Unban.Method](
    Endpoints.V1.Channel.Unban.Path,
    ChannelValidator[Endpoints.V1.Channel.Unban.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Unban.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Update.Method](
    Endpoints.V1.Channel.Update.Path,
    ChannelValidator[Endpoints.V1.Channel.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Update.ActionName],
    ),
);