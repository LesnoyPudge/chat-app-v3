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
    authMiddleware,
    controllerContainer(UserController.some),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/update',
    authMiddleware,
    UserValidator.update,
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
    UserValidator.getMany,
    controllerContainer(UserController.getMany),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/blockUser',
    authMiddleware,
    UserValidator.blockUser,
    controllerContainer(UserController.blockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/unblockUser',
    authMiddleware,
    UserValidator.unblockUser,
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
    UserValidator.sendFriendRequest,
    controllerContainer(UserController.sendFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/acceptFriendRequest',
    authMiddleware,
    UserValidator.acceptFriendRequest,
    controllerContainer(UserController.acceptFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/declineFriendRequest',
    authMiddleware,
    UserValidator.declineFriendRequest,
    controllerContainer(UserController.declineFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/deleteFriend',
    authMiddleware,
    UserValidator.deleteFriend,
    controllerContainer(UserController.deleteFriend),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/activate-account/:activationCode',
    authMiddleware,
    UserValidator.activateAccount,
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
    UserValidator.changeAvatar,
    controllerContainer(UserController.changeAvatar),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changePassword',
    authMiddleware,
    UserValidator.changePassword,
    controllerContainer(UserController.changePassword),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/user/changeExtraStatus',
    authMiddleware,
    UserValidator.changeExtraStatus,
    controllerContainer(UserController.changeExtraStatus),
);