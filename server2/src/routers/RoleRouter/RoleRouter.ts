import { Router } from 'express';
import { RoleController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { RoleValidator } from '@validators';
import { Endpoints } from '@shared';



export const RoleRouter = Router();

RoleRouter[Endpoints.V1.Role.AddMember.Method](
    Endpoints.V1.Role.AddMember.Path,
    RoleValidator[Endpoints.V1.Role.AddMember.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.AddMember.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Create.Method](
    Endpoints.V1.Role.Create.Path,
    RoleValidator[Endpoints.V1.Role.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Create.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Delete.Method](
    Endpoints.V1.Role.Delete.Path,
    RoleValidator[Endpoints.V1.Role.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Delete.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.GetOne.Method](
    Endpoints.V1.Role.GetOne.Path,
    RoleValidator[Endpoints.V1.Role.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.GetOne.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.RemoveMember.Method](
    Endpoints.V1.Role.RemoveMember.Path,
    RoleValidator[Endpoints.V1.Role.RemoveMember.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.RemoveMember.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Update.Method](
    Endpoints.V1.Role.Update.Path,
    RoleValidator[Endpoints.V1.Role.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Update.ActionName],
    ),
);