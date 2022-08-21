import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const PrivateChannelRouter = Router();

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/create',
    // validationHandler(createUserValidator),
    authHandler,
    controllerContainer(PrivateChannelController.create),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getOne',
    authHandler,
    controllerContainer(PrivateChannelController.getOne),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getMany',
    authHandler,
    controllerContainer(PrivateChannelController.getMany),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/update',
    authHandler,
    controllerContainer(PrivateChannelController.update),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/leave',
    authHandler,
    controllerContainer(PrivateChannelController.leave),
);