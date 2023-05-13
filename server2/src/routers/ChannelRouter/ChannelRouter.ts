import { Router } from 'express';
import { ENDPOINTS } from '@shared';
import { authorizationMiddleware } from '@middlewares';



export const ChannelRouter = Router();

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.CREATE,
    authorizationMiddleware,
    (req, res, next) => {
        res.send('hello');
    },
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.GET_ONE,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.UPDATE,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.DELETE,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.MEMBER_LEAVE,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.MEMBER_KICK,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.BAN,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.UNBAN,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.CREATE_INVITATION,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.ACCEPT_INVITATION,
);

ChannelRouter.post(
    ENDPOINTS.V1.CHANNEL.DELETE_INVITATION,
);