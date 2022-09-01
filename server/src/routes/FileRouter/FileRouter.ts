import { Router } from 'express';
import { FileController } from '@controllers';
import { controllerContainer, getEnv } from '@utils';
import { authorizationMiddleware } from '@middlewares';
import { FileValidator } from '@validators';




const { CUSTOM_API_V1_URL } = getEnv();
export const FileRouter = Router();

FileRouter.get(
    CUSTOM_API_V1_URL + '/file/avatar/:avatarId/read',
    authorizationMiddleware,
    FileValidator.readAvatar,
    controllerContainer(FileController.readAvatar),
);

FileRouter.get(
    CUSTOM_API_V1_URL + '/file/attachment/:attachmentId/read',
    authorizationMiddleware,
    FileValidator.readAttachment,
    controllerContainer(FileController.readAttachment),
);

FileRouter.get(
    CUSTOM_API_V1_URL + '/file/avatar/:avatarId/get',
    authorizationMiddleware,
    FileValidator.getAttachmentInfo,
    controllerContainer(FileController.getAttachmentInfo),
);

FileRouter.get(
    CUSTOM_API_V1_URL + '/file/role-image/:imageId/read',
    authorizationMiddleware,
    FileValidator.readRoleImage,
    controllerContainer(FileController.readRoleImage),
);