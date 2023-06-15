import { Router } from 'express';
import { RoleController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { RoleValidator } from '@validators';
import { Endpoints } from '@shared';



export const RoleRouter = Router();

RoleRouter.post(
    Endpoints.V1.Role.AddMember.Path,
    RoleValidator[Endpoints.V1.Role.AddMember.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.AddMember.ActionName],
    ),
);

RoleRouter.post(
    Endpoints.V1.Role.Create.Path,
    RoleValidator[Endpoints.V1.Role.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Create.ActionName],
    ),
);

RoleRouter.post(
    Endpoints.V1.Role.Delete.Path,
    RoleValidator[Endpoints.V1.Role.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Delete.ActionName],
    ),
);

RoleRouter.get(
    Endpoints.V1.Role.GetOne.Path,
    RoleValidator[Endpoints.V1.Role.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.GetOne.ActionName],
    ),
);

RoleRouter.post(
    Endpoints.V1.Role.RemoveMember.Path,
    RoleValidator[Endpoints.V1.Role.RemoveMember.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.RemoveMember.ActionName],
    ),
);

RoleRouter.post(
    Endpoints.V1.Role.Update.Path,
    RoleValidator[Endpoints.V1.Role.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoleController[Endpoints.V1.Role.Update.ActionName],
    ),
);