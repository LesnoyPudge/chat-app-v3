import { Application } from 'express';
import { middlewares } from '@middlewares';
import { ChannelRouter } from './ChannelRouter';
import { UserRouter } from './UserRouter';
import { TextRoomRouter } from './TextRoomRouter';
import { PrivateChannelRouter } from './PrivateChannelRouter';
import { MessageRouter } from './MessageRouter';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
        ChannelRouter,
        TextRoomRouter,
        PrivateChannelRouter,
        MessageRouter,
    ]);

    middlewares.init.errorHandler();
};