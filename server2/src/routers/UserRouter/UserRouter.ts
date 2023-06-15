import { Router } from 'express';
import { UserController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { UserValidator } from '@validators';
import { Endpoints } from '@shared';



export const UserRouter = Router();

UserRouter.post(
    Endpoints.V1.User.AcceptFriendRequest.Path,
    UserValidator[Endpoints.V1.User.AcceptFriendRequest.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.AcceptFriendRequest.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Block.Path,
    UserValidator[Endpoints.V1.User.Block.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Block.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.CredentialsUpdate.Path,
    UserValidator[Endpoints.V1.User.CredentialsUpdate.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.CredentialsUpdate.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.DeclineFriendRequest.Path,
    UserValidator[Endpoints.V1.User.DeclineFriendRequest.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.DeclineFriendRequest.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Delete.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Delete.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.DeleteFriend.Path,
    UserValidator[Endpoints.V1.User.DeleteFriend.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.DeleteFriend.ActionName],
    ),
);

UserRouter.get(
    Endpoints.V1.User.GetOne.Path,
    UserValidator[Endpoints.V1.User.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.GetOne.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.HidePrivateChannel.Path,
    UserValidator[Endpoints.V1.User.HidePrivateChannel.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.HidePrivateChannel.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Login.Path,
    UserValidator[Endpoints.V1.User.Login.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Login.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Logout.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Logout.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.ProfileUpdate.Path,
    UserValidator[Endpoints.V1.User.ProfileUpdate.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.ProfileUpdate.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Refresh.Path,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Refresh.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Registration.Path,
    UserValidator[Endpoints.V1.User.Registration.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Registration.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.RequestAccessCode.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.RequestAccessCode.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.RevokeFriendRequest.Path,
    UserValidator[Endpoints.V1.User.RevokeFriendRequest.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.RevokeFriendRequest.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.SendFriendRequest.Path,
    UserValidator[Endpoints.V1.User.SendFriendRequest.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.SendFriendRequest.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.Unblock.Path,
    UserValidator[Endpoints.V1.User.Unblock.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Unblock.ActionName],
    ),
);

UserRouter.post(
    Endpoints.V1.User.VerifyAccessCode.Path,
    UserValidator[Endpoints.V1.User.VerifyAccessCode.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.VerifyAccessCode.ActionName],
    ),
);