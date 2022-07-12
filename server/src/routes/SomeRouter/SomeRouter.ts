import { Router } from 'express';
import { SomeController } from '../../controllers';
import { middlewares } from '../../middlewares/middlewares';
import { controllerContainer, getEnvVars } from '../../utils';



export const SomeRouter = Router();

const {API_V1_URL} = getEnvVars();

SomeRouter.post(
    `${API_V1_URL}/message`,
    controllerContainer(SomeController.message),
);