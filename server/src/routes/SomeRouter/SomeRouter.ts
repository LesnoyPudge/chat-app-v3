import { Router } from 'express';
import { SomeController } from '../../controllers';
import { middlewares } from '../../middlewares';
import { controllerContainer } from '../../utils';




export const SomeRouter = Router();

SomeRouter.post(
    '/message', 
    middlewares.raw.anotherHandler, 
    controllerContainer(SomeController.message),
);