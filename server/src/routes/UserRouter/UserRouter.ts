import { Router } from 'express';
import { UserController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { UserValidator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
export const UserRouter = Router();

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/auth/registration',
    UserValidator.registration,
    controllerContainer(UserController.registration),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/auth/login',
    UserValidator.login,
    controllerContainer(UserController.login),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/auth/logout',
    controllerContainer(UserController.logout),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/auth/refresh',
    controllerContainer(UserController.refresh),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/:targetId',
    authorizationMiddleware,
    UserValidator.getOne,
    controllerContainer(UserController.getOne),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/profile/update',
    authorizationMiddleware,
    UserValidator.update,
    controllerContainer(UserController.update),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/credentials/update',
    authorizationMiddleware,
    UserValidator.credentialsUpdate,
    controllerContainer(UserController.credentialsUpdate),
);

UserRouter.get(
    CUSTOM_API_V1_URL + '/users/delete',
    authorizationMiddleware,
    controllerContainer(UserController.delete),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/blocked/:targetId/add',
    authorizationMiddleware,
    UserValidator.blockUser,
    controllerContainer(UserController.blockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/blocked/:targetId/remove',
    authorizationMiddleware,
    UserValidator.unblockUser,
    controllerContainer(UserController.unblockUser),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/emails/access-code',
    authorizationMiddleware,
    controllerContainer(UserController.requestAccessCode),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/friends/:targetId/send',
    authorizationMiddleware,
    UserValidator.sendFriendRequest,
    controllerContainer(UserController.sendFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/friends/:targetId/accept',
    authorizationMiddleware,
    UserValidator.acceptFriendRequest,
    controllerContainer(UserController.acceptFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/friends/:targetId/decline',
    authorizationMiddleware,
    UserValidator.declineFriendRequest,
    controllerContainer(UserController.declineFriendRequest),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/friends/:targetId/remove',
    authorizationMiddleware,
    UserValidator.deleteFriend,
    controllerContainer(UserController.deleteFriend),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/activate/:activationCode',
    authorizationMiddleware,
    UserValidator.activateAccount,
    controllerContainer(UserController.activateAccount),
);

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/emails/activation-code',
    authorizationMiddleware,
    controllerContainer(UserController.requestActivationLink),
);