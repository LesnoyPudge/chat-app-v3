import { Router } from 'express';
import { UserController } from '../../controllers';
import { middlewares } from '../../middlewares';
import { controllerContainer, getEnvVars } from '../../utils';
import { validator } from '../../validators';



const { API_V1_URL } = getEnvVars();
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
    // controllerContainer(UserController.create),
);

// UserRouter.post(
//     API_V1_URL + '/user/update',
//     controllerContainer(UserController.update),
// );