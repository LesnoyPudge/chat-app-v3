import { Router } from 'express';
import { MessageController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';
import { validator } from '@validators';



const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler, authHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const MessageRouter = Router();

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/create',
    // validationHandler(createUserValidator),
    authHandler,
    controllerContainer(MessageController.create),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/getOne',
    authHandler,
    controllerContainer(MessageController.getOne),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/getMany',
    authHandler,
    controllerContainer(MessageController.getMany),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/update',
    authHandler,
    controllerContainer(MessageController.update),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/delete',
    authHandler,
    controllerContainer(MessageController.delete),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/restore',
    authHandler,
    controllerContainer(MessageController.restore),
);