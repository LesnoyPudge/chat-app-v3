import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { ChannelValidator } from '@validators';
import { Endpoints } from '@shared';



export const ChannelRouter = Router();

ChannelRouter[Endpoints.V1.Channel.AcceptInvitation.Method](
    Endpoints.V1.Channel.AcceptInvitation.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.AcceptInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Ban.Method](
    Endpoints.V1.Channel.Ban.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Ban.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Ban.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Create.Method](
    Endpoints.V1.Channel.Create.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Create.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Create.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.CreateInvitation.Method](
    Endpoints.V1.Channel.CreateInvitation.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.CreateInvitation.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.CreateInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Delete.Method](
    Endpoints.V1.Channel.Delete.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Delete.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Delete.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.DeleteInvitation.Method](
    Endpoints.V1.Channel.DeleteInvitation.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.DeleteInvitation.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.GetOne.Method](
    Endpoints.V1.Channel.GetOne.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.GetOne.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.GetOne.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Kick.Method](
    Endpoints.V1.Channel.Kick.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Kick.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Kick.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Leave.Method](
    Endpoints.V1.Channel.Leave.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Leave.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Leave.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Unban.Method](
    Endpoints.V1.Channel.Unban.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Unban.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Unban.ActionName],
    ),
);

ChannelRouter[Endpoints.V1.Channel.Update.Method](
    Endpoints.V1.Channel.Update.Path,
    authorizationMiddleware,
    ChannelValidator[Endpoints.V1.Channel.Update.ActionName],
    errorCatcherMiddleware(
        ChannelController[Endpoints.V1.Channel.Update.ActionName],
    ),
);