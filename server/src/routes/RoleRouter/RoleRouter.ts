import { Router } from 'express';
import { RoleController } from '@controllers';
import { authorizationMiddleware, paramsToBodyMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { RoleValidator } from '@validators';




const { CUSTOM_API_V1_URL } = getEnv();

export const RoleRouter = Router();

RoleRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/create',
    authorizationMiddleware,
    RoleValidator.create,
    controllerContainer(RoleController.create),
);

RoleRouter.get(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/:roleId',
    authorizationMiddleware,
    RoleValidator.getOne,
    controllerContainer(RoleController.getOne),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/:roleId/update',
    authorizationMiddleware,
    RoleValidator.update,
    controllerContainer(RoleController.update),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/:roleId/delete',
    authorizationMiddleware,
    RoleValidator.delete,
    controllerContainer(RoleController.delete),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/:roleId/add-user/:targetId',
    authorizationMiddleware,
    RoleValidator.addUser,
    controllerContainer(RoleController.addUser),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/roles/:roleId/remove-user/:targetId',
    authorizationMiddleware,
    RoleValidator.deleteUser,
    controllerContainer(RoleController.deleteUser),
);