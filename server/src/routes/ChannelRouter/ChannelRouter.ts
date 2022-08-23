import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';



const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const ChannelRouter = Router();

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create',
    // (createUserValidator),
    authMiddleware,
    controllerContainer(ChannelController.create),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getOne',
    authMiddleware,
    controllerContainer(ChannelController.getOne),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getMany',
    authMiddleware,
    controllerContainer(ChannelController.getMany),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/update',
    authMiddleware,
    controllerContainer(ChannelController.update),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete',
    authMiddleware,
    controllerContainer(ChannelController.delete),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/leave',
    authMiddleware,
    controllerContainer(ChannelController.leave),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/kick-user',
    authMiddleware,
    controllerContainer(ChannelController.kickUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/ban-user',
    authMiddleware,
    controllerContainer(ChannelController.banUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/unban-user',
    authMiddleware,
    controllerContainer(ChannelController.unbanUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create-invitation',
    authMiddleware,
    controllerContainer(ChannelController.createInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/accept-invitation',
    authMiddleware,
    controllerContainer(ChannelController.acceptInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete-invitation',
    authMiddleware,
    controllerContainer(ChannelController.deleteInvitation),
);