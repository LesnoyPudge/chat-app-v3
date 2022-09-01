import { Router } from 'express';
import { RoomController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { RoomValidator } from '@validators';




const { CUSTOM_API_V1_URL } = getEnv();

export const RoomRouter = Router();

RoomRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/rooms/create',
    authorizationMiddleware,
    RoomValidator.create,
    controllerContainer(RoomController.create),
);

RoomRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/rooms/:roomId',
    authorizationMiddleware,
    RoomValidator.getOne,
    controllerContainer(RoomController.getOne),
);

RoomRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/rooms/:roomId/update',
    authorizationMiddleware,
    RoomValidator.update,
    controllerContainer(RoomController.update),
);

RoomRouter.post(
    CUSTOM_API_V1_URL + '/channels/:channelId/rooms/:roomId/delete',
    authorizationMiddleware,
    RoomValidator.delete,
    controllerContainer(RoomController.delete),
);