import { Router } from 'express';
import { UserController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
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
    UserValidator.login,
    controllerContainer(UserController.login),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/logout',
    controllerContainer(UserController.logout),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/refresh',
    controllerContainer(UserController.refresh),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/some',
    authorizationMiddleware,
    controllerContainer(UserController.some),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getOne',
    authorizationMiddleware,
    UserValidator.getOne,
    controllerContainer(UserController.getOne),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/getMany',
    authorizationMiddleware,
    UserValidator.getMany,
    controllerContainer(UserController.getMany),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/update',
    authorizationMiddleware,
    UserValidator.update,
    controllerContainer(UserController.update),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/user/delete',
    authorizationMiddleware,
    controllerContainer(UserController.delete),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/blockUser',
    authorizationMiddleware,
    UserValidator.blockUser,
    controllerContainer(UserController.blockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/unblockUser',
    authorizationMiddleware,
    UserValidator.unblockUser,
    controllerContainer(UserController.unblockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestAccessCode',
    authorizationMiddleware,
    controllerContainer(UserController.requestAccessCode),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/sendFriendRequest',
    authorizationMiddleware,
    UserValidator.sendFriendRequest,
    controllerContainer(UserController.sendFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/acceptFriendRequest',
    authorizationMiddleware,
    UserValidator.acceptFriendRequest,
    controllerContainer(UserController.acceptFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/declineFriendRequest',
    authorizationMiddleware,
    UserValidator.declineFriendRequest,
    controllerContainer(UserController.declineFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/deleteFriend',
    authorizationMiddleware,
    UserValidator.deleteFriend,
    controllerContainer(UserController.deleteFriend),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/activate-account/:activationCode',
    authorizationMiddleware,
    UserValidator.activateAccount,
    controllerContainer(UserController.activateAccount),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/requestActivationLink',
    authorizationMiddleware,
    controllerContainer(UserController.requestActivationLink),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changeAvatar',
    authorizationMiddleware,
    UserValidator.changeAvatar,
    controllerContainer(UserController.changeAvatar),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changePassword',
    authorizationMiddleware,
    UserValidator.changePassword,
    controllerContainer(UserController.changePassword),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changeExtraStatus',
    authorizationMiddleware,
    UserValidator.changeExtraStatus,
    controllerContainer(UserController.changeExtraStatus),
);