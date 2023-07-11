import { Router } from 'express';
import { RoomController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from '@middlewares';
import { RoomValidator } from '@validators';
import { Endpoints } from '@shared';



export const RoomRouter = Router();

RoomRouter[Endpoints.V1.Room.Create.Method](
    Endpoints.V1.Room.Create.Path,
    RoomValidator[Endpoints.V1.Room.Create.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Create.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.Delete.Method](
    Endpoints.V1.Room.Delete.Path,
    RoomValidator[Endpoints.V1.Room.Delete.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Delete.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.GetOne.Method](
    Endpoints.V1.Room.GetOne.Path,
    RoomValidator[Endpoints.V1.Room.GetOne.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.GetOne.ActionName],
    ),
);

RoomRouter[Endpoints.V1.Room.Update.Method](
    Endpoints.V1.Room.Update.Path,
    RoomValidator[Endpoints.V1.Room.Update.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        RoomController[Endpoints.V1.Room.Update.ActionName],
    ),
);