import { Application } from 'express';
import { middlewares } from '../middlewares/middlewares';
import { SomeRouter } from './SomeRouter';
import { UserRouter } from './UserRouter';



export const routesInit = (app: Application) => {
    app.use([
        SomeRouter, 
        UserRouter,
    ]);

    middlewares.init.errorHandler();
};