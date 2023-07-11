import { Router } from 'express';
import { FileController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware, paramsToBodyMiddleware } from '@middlewares';
import { FileValidator } from '@validators';
import { Endpoints } from '@shared';



export const FileRouter = Router();

FileRouter[Endpoints.V1.File.Download.Method](
    `${Endpoints.V1.File.Download.Path}/:fileId`,
    paramsToBodyMiddleware,
    FileValidator[Endpoints.V1.File.Download.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        FileController[Endpoints.V1.File.Download.ActionName],
    ),
);

FileRouter[Endpoints.V1.File.Read.Method](
    `${Endpoints.V1.File.Read.Path}/:fileId`,
    paramsToBodyMiddleware,
    FileValidator[Endpoints.V1.File.Read.ActionName],
    authorizationMiddleware,
    errorCatcherMiddleware(
        FileController[Endpoints.V1.File.Read.ActionName],
    ),
);