import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { authorizationMiddleware} from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const PrivateChannelRouter = Router();

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/create',
    // (createUserValidator),
    authorizationMiddleware,
    controllerContainer(PrivateChannelController.create),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getOne',
    authorizationMiddleware,
    controllerContainer(PrivateChannelController.getOne),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getMany',
    authorizationMiddleware,
    controllerContainer(PrivateChannelController.getMany),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/update',
    authorizationMiddleware,
    controllerContainer(PrivateChannelController.update),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/leave',
    authorizationMiddleware,
    controllerContainer(PrivateChannelController.leave),
);