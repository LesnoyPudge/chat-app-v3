import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { ChannelValidator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
export const ChannelRouter = Router();

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create',
    authorizationMiddleware,
    ChannelValidator.create,
    controllerContainer(ChannelController.create),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/getOne',
    authorizationMiddleware,
    ChannelValidator.getOne,
    controllerContainer(ChannelController.getOne),
);

// ChannelRouter.post(
//     CUSTOM_API_V1_URL + '/channel/getMany',
//     authorizationMiddleware,
//     ChannelValidator.getMany,
//     controllerContainer(ChannelController.getMany),
// );

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/update',
    authorizationMiddleware,
    ChannelValidator.update,
    controllerContainer(ChannelController.update),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete',
    authorizationMiddleware,
    ChannelValidator.delete,
    controllerContainer(ChannelController.delete),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/leave',
    authorizationMiddleware,
    ChannelValidator.leave,
    controllerContainer(ChannelController.leave),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/kick-user',
    authorizationMiddleware,
    ChannelValidator.kickUser,
    controllerContainer(ChannelController.kickUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/ban-user',
    authorizationMiddleware,
    ChannelValidator.banUser,
    controllerContainer(ChannelController.banUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/unban-user',
    authorizationMiddleware,
    ChannelValidator.unbanUser,
    controllerContainer(ChannelController.unbanUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/create-invitation',
    authorizationMiddleware,
    ChannelValidator.createInvitation,
    controllerContainer(ChannelController.createInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/accept-invitation',
    authorizationMiddleware,
    ChannelValidator.acceptInvitation,
    controllerContainer(ChannelController.acceptInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channel/delete-invitation',
    authorizationMiddleware,
    ChannelValidator.deleteInvitation,
    controllerContainer(ChannelController.deleteInvitation),
);