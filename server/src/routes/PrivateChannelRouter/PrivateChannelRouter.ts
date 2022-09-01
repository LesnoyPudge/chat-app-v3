import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { PrivateChannelValidator } from '@validators';




const { CUSTOM_API_V1_URL } = getEnv();

export const PrivateChannelRouter = Router();

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/users/private-channel/create',
    authorizationMiddleware,
    PrivateChannelValidator.create,
    controllerContainer(PrivateChannelController.create),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + ' /users/private-channel/:privateChannelId',
    authorizationMiddleware,
    PrivateChannelValidator.getOne,
    controllerContainer(PrivateChannelController.getOne),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/users/private-channel/:privateChannelId/leave',
    authorizationMiddleware,
    PrivateChannelValidator.leave,
    controllerContainer(PrivateChannelController.leave),
);