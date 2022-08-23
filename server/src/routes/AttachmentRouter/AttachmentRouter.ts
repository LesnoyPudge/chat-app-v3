import { Router } from 'express';
import { AttachmentController } from '@controllers';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();
// const { createUserValidator } = validator.user;
export const AttachmentRouter = Router();

AttachmentRouter.get(
    CUSTOM_API_V1_URL + '/attachment/:attachmentId',
    // (createUserValidator),
    controllerContainer(AttachmentController.read),
);