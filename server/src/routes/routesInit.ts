import { Application } from 'express';
import { middlewares } from '@middlewares';
import { ChannelRouter } from './ChannelRouter';
import { UserRouter } from './UserRouter';
import { TextRoomRouter } from './TextRoomRouter';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
        ChannelRouter,
        TextRoomRouter,
    ]);

    middlewares.init.errorHandler();
};