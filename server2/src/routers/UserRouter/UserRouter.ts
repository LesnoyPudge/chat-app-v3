import { Router } from 'express';
import { UserController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { UserValidator } from '@validators';
import { Endpoints } from '@shared';



export const UserRouter = Router();

UserRouter[Endpoints.V1.User.AcceptFriendRequest.Method](
    Endpoints.V1.User.AcceptFriendRequest.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.AcceptFriendRequest.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.AcceptFriendRequest.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Block.Method](
    Endpoints.V1.User.Block.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.Block.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Block.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.CredentialsUpdate.Method](
    Endpoints.V1.User.CredentialsUpdate.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.CredentialsUpdate.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.CredentialsUpdate.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.DeclineFriendRequest.Method](
    Endpoints.V1.User.DeclineFriendRequest.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.DeclineFriendRequest.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.DeclineFriendRequest.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Delete.Method](
    Endpoints.V1.User.Delete.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Delete.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.DeleteFriend.Method](
    Endpoints.V1.User.DeleteFriend.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.DeleteFriend.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.DeleteFriend.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.GetOne.Method](
    Endpoints.V1.User.GetOne.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.GetOne.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.GetOne.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.HidePrivateChannel.Method](
    Endpoints.V1.User.HidePrivateChannel.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.HidePrivateChannel.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.HidePrivateChannel.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Login.Method](
    Endpoints.V1.User.Login.Path,
    UserValidator[Endpoints.V1.User.Login.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Login.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Logout.Method](
    Endpoints.V1.User.Logout.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Logout.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.ProfileUpdate.Method](
    Endpoints.V1.User.ProfileUpdate.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.ProfileUpdate.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.ProfileUpdate.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Refresh.Method](
    Endpoints.V1.User.Refresh.Path,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Refresh.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Registration.Method](
    Endpoints.V1.User.Registration.Path,
    UserValidator[Endpoints.V1.User.Registration.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Registration.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.RequestAccessCode.Method](
    Endpoints.V1.User.RequestAccessCode.Path,
    authorizationMiddleware,
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.RequestAccessCode.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.RevokeFriendRequest.Method](
    Endpoints.V1.User.RevokeFriendRequest.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.RevokeFriendRequest.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.RevokeFriendRequest.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.SendFriendRequest.Method](
    Endpoints.V1.User.SendFriendRequest.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.SendFriendRequest.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.SendFriendRequest.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.Unblock.Method](
    Endpoints.V1.User.Unblock.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.Unblock.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.Unblock.ActionName],
    ),
);

UserRouter[Endpoints.V1.User.VerifyAccessCode.Method](
    Endpoints.V1.User.VerifyAccessCode.Path,
    authorizationMiddleware,
    UserValidator[Endpoints.V1.User.VerifyAccessCode.ActionName],
    errorCatcherMiddleware(
        UserController[Endpoints.V1.User.VerifyAccessCode.ActionName],
    ),
);