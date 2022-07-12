import { Router } from 'express';
import { UserController } from '../../controllers';
import { controllerContainer, getEnvVars } from '../../utils';



export const UserRouter = Router();

const {API_V1_URL} = getEnvVars();

UserRouter.post(
    `${API_V1_URL}/user/create`,
    controllerContainer(UserController.create),
);