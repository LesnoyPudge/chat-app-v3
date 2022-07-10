import { Router } from 'express';
import { UserController } from '../../controllers';
import { middlewares } from '../../middlewares';
import { controllerContainer } from '../../utils';



export const UserRouter = Router();

UserRouter.post(
    'user/create', 
    middlewares.raw.anotherHandler, 
    controllerContainer(UserController.create),
);