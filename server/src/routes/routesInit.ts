import { Application } from 'express';
import { ChannelRouter } from './ChannelRouter';
import { UserRouter } from './UserRouter';
import { RoomRouter } from './RoomRouter';
import { PrivateChannelRouter } from './PrivateChannelRouter';
import { MessageRouter } from './MessageRouter';
import { RoleRouter } from './RoleRouter';
import { FileRouter } from './FileRouter';
import { errorHandlerMiddleware } from '@middlewares';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
        ChannelRouter,
        RoomRouter,
        PrivateChannelRouter,
        MessageRouter,
        RoleRouter,
        FileRouter,
    ]);

    app.use(errorHandlerMiddleware);
};