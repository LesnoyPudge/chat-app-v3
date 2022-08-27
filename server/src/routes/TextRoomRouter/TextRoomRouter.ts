import { Router } from 'express';
import { TextRoomController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const TextRoomRouter = Router();

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/create',
    // (createUserValidator),
    authorizationMiddleware,
    controllerContainer(TextRoomController.create),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/getOne',
    authorizationMiddleware,
    controllerContainer(TextRoomController.getOne),
);

// TextRoomRouter.post(
//     CUSTOM_API_V1_URL + '/text-room/getMany',
//     authorizationMiddleware,
//     controllerContainer(TextRoomController.getMany),
// );

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/update',
    authorizationMiddleware,
    controllerContainer(TextRoomController.update),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/delete',
    authorizationMiddleware,
    controllerContainer(TextRoomController.delete),
);