import { Router } from 'express';
import { AttachmentController } from '@controllers';
import { middlewares } from '@middlewares';
import { controllerContainer, getEnv } from '@utils';




const { CUSTOM_API_V1_URL } = getEnv();
const { validationHandler } = middlewares.raw;
// const { createUserValidator } = validator.user;
export const AttachmentRouter = Router();

AttachmentRouter.get(
    CUSTOM_API_V1_URL + '/attachment/:attachmentId',
    // validationHandler(createUserValidator),
    controllerContainer(AttachmentController.read),
);