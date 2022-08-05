import { Router } from 'express';
import { UserController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { validator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
const { createUserValidator } = validator.user;
export const UserRouter = Router();

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/registration',
    validationHandler(createUserValidator),
    controllerContainer(UserController.registration),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/login',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.login),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/logout',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.logout),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/refresh',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.refresh),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/some',
    authHandler,
    controllerContainer(UserController.some),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/update',
    authHandler,
    controllerContainer(UserController.update),
);