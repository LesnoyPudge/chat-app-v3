import { Router } from 'express';
import { UserController } from '../../controllers';
import { middlewares } from '../../middlewares';
import { controllerContainer, getEnv } from '../../utils';
import { validator } from '../../validators';



const { API_V1_URL } = getEnv();
const { validationHandler } = middlewares.raw;
const { createUserValidator } = validator.user;
export const UserRouter = Router();

UserRouter.post(
    API_V1_URL + '/user/registration',
    validationHandler(createUserValidator),
    controllerContainer(UserController.registration),
);

UserRouter.post(
    API_V1_URL + '/user/login',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.login),
);

UserRouter.get(
    API_V1_URL + '/user/logout',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.logout),
);

UserRouter.get(
    API_V1_URL + '/user/refresh',
    // validationHandler(createUserValidator),
    controllerContainer(UserController.refresh),
);

UserRouter.get(
    API_V1_URL + '/user/some',
    middlewares.raw.authHandler,
    controllerContainer(UserController.some),
);

UserRouter.post(
    API_V1_URL + '/user/update',
    middlewares.raw.authHandler,
    controllerContainer(UserController.update),
);