import { Router } from 'express';
import { RoleController } from '@controllers';
import { authMiddleware} from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const RoleRouter = Router();

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/create',
    // (createUserValidator),
    authMiddleware,
    controllerContainer(RoleController.create),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getOne',
    authMiddleware,
    controllerContainer(RoleController.getOne),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getMany',
    authMiddleware,
    controllerContainer(RoleController.getMany),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/update',
    authMiddleware,
    controllerContainer(RoleController.update),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/delete',
    authMiddleware,
    controllerContainer(RoleController.delete),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/addUser',
    authMiddleware,
    controllerContainer(RoleController.addUser),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/deleteUser',
    authMiddleware,
    controllerContainer(RoleController.deleteUser),
);