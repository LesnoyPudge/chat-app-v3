import { Router } from 'express';
import { PrivateChannelController } from '@controllers';
import { authMiddleware} from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();

// const { createUserValidator } = validator.user;
export const PrivateChannelRouter = Router();

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/create',
    // (createUserValidator),
    authMiddleware,
    controllerContainer(PrivateChannelController.create),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getOne',
    authMiddleware,
    controllerContainer(PrivateChannelController.getOne),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/getMany',
    authMiddleware,
    controllerContainer(PrivateChannelController.getMany),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/update',
    authMiddleware,
    controllerContainer(PrivateChannelController.update),
);

PrivateChannelRouter.post(
    CUSTOM_API_V1_URL + '/private-channel/leave',
    authMiddleware,
    controllerContainer(PrivateChannelController.leave),
);