import { Router } from 'express';
import { RoleController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { validator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const RoleRouter = Router();

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/create',
    // validationHandler(createUserValidator),
    authHandler,
    controllerContainer(RoleController.create),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getOne',
    authHandler,
    controllerContainer(RoleController.getOne),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/getMany',
    authHandler,
    controllerContainer(RoleController.getMany),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/update',
    authHandler,
    controllerContainer(RoleController.update),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/delete',
    authHandler,
    controllerContainer(RoleController.delete),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/addUser',
    authHandler,
    controllerContainer(RoleController.addUser),
);

RoleRouter.post(
    CUSTOM_API_V1_URL + '/role/deleteUser',
    authHandler,
    controllerContainer(RoleController.deleteUser),
);