import { Application } from 'express';
import { middlewares } from '@middlewares';
import { ChannelRouter } from './ChannelRouter';
import { UserRouter } from './UserRouter';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
        ChannelRouter,
    ]);

    middlewares.init.errorHandler();
};