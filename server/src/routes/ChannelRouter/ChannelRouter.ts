import { Router } from 'express';
import { ChannelController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { validator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const ChannelRouter = Router();

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create',
    // validationHandler(createUserValidator),
    authHandler,
    controllerContainer(ChannelController.create),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getOne',
    authHandler,
    controllerContainer(ChannelController.getOne),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getMany',
    authHandler,
    controllerContainer(ChannelController.getMany),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/update',
    authHandler,
    controllerContainer(ChannelController.update),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete',
    authHandler,
    controllerContainer(ChannelController.delete),
);