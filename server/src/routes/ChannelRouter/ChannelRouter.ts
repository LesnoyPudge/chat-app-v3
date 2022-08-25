import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { ChannelValidator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
export const ChannelRouter = Router();

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create',
    authMiddleware,
    ChannelValidator.create,
    controllerContainer(ChannelController.create),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getOne',
    authMiddleware,
    ChannelValidator.getOne,
    controllerContainer(ChannelController.getOne),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getMany',
    authMiddleware,
    ChannelValidator.getMany,
    controllerContainer(ChannelController.getMany),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/update',
    authMiddleware,
    ChannelValidator.update,
    controllerContainer(ChannelController.update),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete',
    authMiddleware,
    ChannelValidator.delete,
    controllerContainer(ChannelController.delete),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/leave',
    authMiddleware,
    ChannelValidator.leave,
    controllerContainer(ChannelController.leave),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/kick-user',
    authMiddleware,
    ChannelValidator.kickUser,
    controllerContainer(ChannelController.kickUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/ban-user',
    authMiddleware,
    ChannelValidator.banUser,
    controllerContainer(ChannelController.banUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/unban-user',
    authMiddleware,
    ChannelValidator.unbanUser,
    controllerContainer(ChannelController.unbanUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create-invitation',
    authMiddleware,
    ChannelValidator.createInvitation,
    controllerContainer(ChannelController.createInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/accept-invitation',
    authMiddleware,
    ChannelValidator.acceptInvitation,
    controllerContainer(ChannelController.acceptInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete-invitation',
    authMiddleware,
    ChannelValidator.deleteInvitation,
    controllerContainer(ChannelController.deleteInvitation),
);