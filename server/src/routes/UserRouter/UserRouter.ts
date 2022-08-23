import { Router } from 'express';
import { UserController } from '@controllers';
import { authMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { UserValidator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
export const UserRouter = Router();

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/registration',
    UserValidator.registration,
    controllerContainer(UserController.registration),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/login',
    // (createUserValidator),
    controllerContainer(UserController.login),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/logout',
    // (createUserValidator),
    controllerContainer(UserController.logout),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/refresh',
    // (createUserValidator),
    controllerContainer(UserController.refresh),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/some',
    authMiddleware,
    controllerContainer(UserController.some),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/update',
    authMiddleware,
    controllerContainer(UserController.update),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getOne',
    authMiddleware,
    UserValidator.getOne,
    controllerContainer(UserController.getOne),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getMany',
    authMiddleware,
    controllerContainer(UserController.getMany),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/blockUser',
    authMiddleware,
    controllerContainer(UserController.blockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/unblockUser',
    authMiddleware,
    controllerContainer(UserController.unblockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestAccessCode',
    authMiddleware,
    controllerContainer(UserController.requestAccessCode),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/sendFriendRequest',
    authMiddleware,
    controllerContainer(UserController.sendFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/acceptFriendRequest',
    authMiddleware,
    controllerContainer(UserController.acceptFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/declineFriendRequest',
    authMiddleware,
    controllerContainer(UserController.declineFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/deleteFriend',
    authMiddleware,
    controllerContainer(UserController.deleteFriend),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/activate-account/:activationCode',
    authMiddleware,
    controllerContainer(UserController.activateAccount),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestActivationLink',
    authMiddleware,
    controllerContainer(UserController.requestActivationLink),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changeAvatar',
    authMiddleware,
    controllerContainer(UserController.changeAvatar),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changePassword',
    authMiddleware,
    controllerContainer(UserController.changePassword),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changeExtraStatus',
    authMiddleware,
    controllerContainer(UserController.changeExtraStatus),
);