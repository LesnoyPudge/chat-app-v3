import { Router } from 'express';
import { RoleController } from '@controllers';
import { authorizationMiddleware} from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const RoleRouter = Router();

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/create',
    // (createUserValidator),
    authorizationMiddleware,
    controllerContainer(RoleController.create),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getOne',
    authorizationMiddleware,
    controllerContainer(RoleController.getOne),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getMany',
    authorizationMiddleware,
    controllerContainer(RoleController.getMany),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/update',
    authorizationMiddleware,
    controllerContainer(RoleController.update),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/delete',
    authorizationMiddleware,
    controllerContainer(RoleController.delete),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/addUser',
    authorizationMiddleware,
    controllerContainer(RoleController.addUser),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/deleteUser',
    authorizationMiddleware,
    controllerContainer(RoleController.deleteUser),
);