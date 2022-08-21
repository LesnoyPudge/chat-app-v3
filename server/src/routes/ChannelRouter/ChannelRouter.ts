import { Router } from 'express';
import { ChannelController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';



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

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/leave',
    authHandler,
    controllerContainer(ChannelController.leave),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/kick-user',
    authHandler,
    controllerContainer(ChannelController.kickUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/ban-user',
    authHandler,
    controllerContainer(ChannelController.banUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/unban-user',
    authHandler,
    controllerContainer(ChannelController.unbanUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create-invitation',
    authHandler,
    controllerContainer(ChannelController.createInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/accept-invitation',
    authHandler,
    controllerContainer(ChannelController.acceptInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete-invitation',
    authHandler,
    controllerContainer(ChannelController.deleteInvitation),
);