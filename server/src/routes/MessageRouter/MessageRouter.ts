import { Router } from 'express';
import { MessageController } from '@controllers';
import { authMiddleware} from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const MessageRouter = Router();

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/create',
    // (createUserValidator),
    authMiddleware,
    controllerContainer(MessageController.create),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/getOne',
    authMiddleware,
    controllerContainer(MessageController.getOne),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/getMany',
    authMiddleware,
    controllerContainer(MessageController.getMany),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/update',
    authMiddleware,
    controllerContainer(MessageController.update),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/delete',
    authMiddleware,
    controllerContainer(MessageController.delete),
);

MessageRouter.post(
    CUSTOM_API_V1_URL + '/message/restore',
    authMiddleware,
    controllerContainer(MessageController.restore),
);