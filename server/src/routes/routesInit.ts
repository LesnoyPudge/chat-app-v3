import { Application } from 'express';
import { middlewares } from '../middlewares';
import { UserRouter } from './UserRouter';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
    ]);

    middlewares.init.errorHandler();
};