import { Router } from 'express';
import { TextRoomController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { validator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const TextRoomRouter = Router();

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/create',
    // validationHandler(createUserValidator),
    authHandler,
    controllerContainer(TextRoomController.create),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/getOne',
    authHandler,
    controllerContainer(TextRoomController.getOne),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/getMany',
    authHandler,
    controllerContainer(TextRoomController.getMany),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/update',
    authHandler,
    controllerContainer(TextRoomController.update),
);

TextRoomRouter.post(
    CUSTOM_API_V1_URL + '/text-room/delete',
    authHandler,
    controllerContainer(TextRoomController.delete),
);