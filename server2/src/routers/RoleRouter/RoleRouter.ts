import { Router } from 'express';
import { RoleController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { RoleValidator } from '@validators';
import { Endpoints } from '@shared';



export const RoleRouter = Router();

RoleRouter[Endpoints.V1.Role.AddMember.Method](
    Endpoints.V1.Role.AddMember.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.AddMember.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.AddMember.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Create.Method](
    Endpoints.V1.Role.Create.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.Create.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Create.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Delete.Method](
    Endpoints.V1.Role.Delete.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.Delete.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Delete.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.GetOne.Method](
    Endpoints.V1.Role.GetOne.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.GetOne.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.GetOne.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.RemoveMember.Method](
    Endpoints.V1.Role.RemoveMember.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.RemoveMember.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.RemoveMember.ActionName],
    ),
);

RoleRouter[Endpoints.V1.Role.Update.Method](
    Endpoints.V1.Role.Update.Path,
    authorizationMiddleware,
    RoleValidator[Endpoints.V1.Role.Update.ActionName],
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Update.ActionName],
    ),
);