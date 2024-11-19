import { Router } from 'express';
import { HelperController } from '@controllers';
import { authorizationMiddleware, errorCatcherMiddleware } from 'src/middlewares';
import { HelperValidator } from '@validators';
import { Endpoints } from '@shared';



export const HelperRouter = Router();

HelperRouter[Endpoints.V1.Helper.GetAvailableTextRoomIds.Method](
    Endpoints.V1.Helper.GetAvailableTextRoomIds.Path,
    authorizationMiddleware,
    HelperValidator[Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionName],
    errorCatcherMiddleware(
        HelperController[Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionName],
    ),
);