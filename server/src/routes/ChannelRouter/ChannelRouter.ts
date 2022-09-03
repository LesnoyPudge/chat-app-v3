import { Router } from 'express';
import { ChannelController } from '@controllers';
import { authorizationMiddleware, paramsToBodyMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { ChannelValidator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
export const ChannelRouter = Router();

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/create',
    authorizationMiddleware,
    ChannelValidator.create,
    controllerContainer(ChannelController.create),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId',
    authorizationMiddleware,
    ChannelValidator.getOne,
    controllerContainer(ChannelController.getOne),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/update',
    authorizationMiddleware,
    ChannelValidator.update,
    controllerContainer(ChannelController.update),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/delete',
    authorizationMiddleware,
    ChannelValidator.delete,
    controllerContainer(ChannelController.delete),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/members/leave',
    authorizationMiddleware,
    ChannelValidator.leave,
    controllerContainer(ChannelController.leave),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/members/:targetId/kick',
    authorizationMiddleware,
    ChannelValidator.kickUser,
    controllerContainer(ChannelController.kickUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/banned/:targetId/ban',
    authorizationMiddleware,
    ChannelValidator.banUser,
    controllerContainer(ChannelController.banUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/banned/:targetId/unban',
    authorizationMiddleware,
    ChannelValidator.unbanUser,
    controllerContainer(ChannelController.unbanUser),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/invitations/create',
    authorizationMiddleware,
    ChannelValidator.createInvitation,
    controllerContainer(ChannelController.createInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/invitations/:invitationCode/accept',
    authorizationMiddleware,
    ChannelValidator.acceptInvitation,
    controllerContainer(ChannelController.acceptInvitation),
);

ChannelRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/invitations/:invitationId/delete',
    authorizationMiddleware,
    ChannelValidator.deleteInvitation,
    controllerContainer(ChannelController.deleteInvitation),
);