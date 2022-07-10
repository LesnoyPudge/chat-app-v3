import { Application } from 'express';
import { middlewares } from '../middlewares';
import { getEnvVars } from '../utils';
import { SomeRouter } from './SomeRouter';
import { UserRouter } from './UserRouter';



export const routesInit = (app: Application) => {
    const {API_V1_URL} = getEnvVars();
    
    app.use(API_V1_URL, SomeRouter);
    app.use(API_V1_URL, UserRouter);

    middlewares.init.errorHandler();
};