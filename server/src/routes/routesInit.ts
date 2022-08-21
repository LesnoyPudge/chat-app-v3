import { Application } from 'express';
import { middlewares } from '@middlewares';
import { ChannelRouter } from './ChannelRouter';
import { UserRouter } from './UserRouter';
import { TextRoomRouter } from './TextRoomRouter';
import { PrivateChannelRouter } from './PrivateChannelRouter';
import { MessageRouter } from './MessageRouter';
import { RoleRouter } from './RoleRouter';
import { AttachmentRouter } from './AttachmentRouter';



export const routesInit = (app: Application) => {
    app.use([
        UserRouter,
        ChannelRouter,
        TextRoomRouter,
        PrivateChannelRouter,
        MessageRouter,
        RoleRouter,
        AttachmentRouter,
    ]);

    middlewares.init.errorHandler();
};