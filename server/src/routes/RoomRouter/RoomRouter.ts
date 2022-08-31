import { Router } from 'express';
import { RoomController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const RoomRouter = Router();

RoomRouter.post(
    CUSTOM_API_V1_URL + '/room/create',
    // (createUserValidator),
    authorizationMiddleware,
    controllerContainer(RoomController.create),
);

RoomRouter.post(
    CUSTOM_API_V1_URL + '/room/getOne',
    authorizationMiddleware,
    controllerContainer(RoomController.getOne),
);

// RoomRouter.post(
//     CUSTOM_API_V1_URL + '/room/getMany',
//     authorizationMiddleware,
//     controllerContainer(RoomController.getMany),
// );

RoomRouter.post(
    CUSTOM_API_V1_URL + '/room/update',
    authorizationMiddleware,
    controllerContainer(RoomController.update),
);

RoomRouter.post(
    CUSTOM_API_V1_URL + '/room/delete',
    authorizationMiddleware,
    controllerContainer(RoomController.delete),
);