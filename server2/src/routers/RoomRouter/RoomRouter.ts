import { Router } from 'express';
import { RoomController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { RoomValidator } from '@validators';
import { Endpoints } from '@shared';



export const RoomRouter = Router();

RoomRouter[Endpoints.V1.Room.Create.Method](
    Endpoints.V1.Room.Create.Path,
    authorizationMiddleware,
    RoomValidator[Endpoints.V1.Room.Create.ActionName],
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Create.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.Delete.Method](
    Endpoints.V1.Room.Delete.Path,
    authorizationMiddleware,
    RoomValidator[Endpoints.V1.Room.Delete.ActionName],
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Delete.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.GetOne.Method](
    Endpoints.V1.Room.GetOne.Path,
    authorizationMiddleware,
    RoomValidator[Endpoints.V1.Room.GetOne.ActionName],
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.GetOne.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.Update.Method](
    Endpoints.V1.Room.Update.Path,
    authorizationMiddleware,
    RoomValidator[Endpoints.V1.Room.Update.ActionName],
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Update.ActionName],
    ),
);