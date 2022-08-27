import { Router } from 'express';
import { MessageController } from '@controllers';
import { authorizationMiddleware } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const MessageRouter = Router();

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/create',
    // (createUserValidator),
    authorizationMiddleware,
    controllerContainer(MessageController.create),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/getOne',
    authorizationMiddleware,
    controllerContainer(MessageController.getOne),
);

// MessageRouter.post(
//     CUSTOM_API_V1_URL + '/message/getMany',
//     authorizationMiddleware,
//     controllerContainer(MessageController.getMany),
// );

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/update',
    authorizationMiddleware,
    controllerContainer(MessageController.update),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/delete',
    authorizationMiddleware,
    controllerContainer(MessageController.delete),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/restore',
    authorizationMiddleware,
    controllerContainer(MessageController.restore),
);