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

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getOne',
    authHandler,
    controllerContainer(UserController.getOne),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getMany',
    authHandler,
    controllerContainer(UserController.getMany),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/blockUser',
    authHandler,
    controllerContainer(UserController.blockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/unblockUser',
    authHandler,
    controllerContainer(UserController.unblockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestAccessCode',
    authHandler,
    controllerContainer(UserController.requestAccessCode),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/sendFriendRequest',
    authHandler,
    controllerContainer(UserController.sendFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/acceptFriendRequest',
    authHandler,
    controllerContainer(UserController.acceptFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/declineFriendRequest',
    authHandler,
    controllerContainer(UserController.declineFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/deleteFriend',
    authHandler,
    controllerContainer(UserController.deleteFriend),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/activate-account/:activationCode',
    authHandler,
    controllerContainer(UserController.activateAccount),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestActivationLink',
    authHandler,
    controllerContainer(UserController.requestActivationLink),
);