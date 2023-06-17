import '@total-typescript/ts-reset';
import './env';
import http from 'http';
import { databaseConnection } from '@database';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnv, token } from '@utils';
import { errorHandlerMiddleware } from '@middlewares';
import { Server } from 'socket.io';
import { ApiError } from '@errors';
import { Sockets } from './subscription/Sockets';



const {
    CUSTOM_CLIENT_URL,
    CUSTOM_SERVER_PORT,
} = getEnv();

const app = express();
const server = http.createServer(app);

const socketServer = new Server(server, {
    cors: {
        origin: CUSTOM_CLIENT_URL,
        methods: ['GET', 'POST'],
    },
}) as AuthorizedServer;

socketServer.use((socket, next) => {
    const data = socket.data;
    if (!data.accessToken) return next(ApiError.unauthorized());
            
    const tokenData = token.validateAccessToken(data.accessToken);
    if (!tokenData) return next(ApiError.unauthorized());

    data.tokenData = tokenData;

    next();
});

export const sockets = new Sockets(socketServer);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CUSTOM_CLIENT_URL,
}));

import { ChannelRouter, ChatRouter, FileRouter, MessageRouter, PrivateChannelRouter, RoleRouter, RoomRouter, UserRouter } from '@routers';
import { AuthorizedServer } from '@types';



app.use([
    UserRouter,
    ChannelRouter,
    RoomRouter,
    PrivateChannelRouter,
    MessageRouter,
    RoleRouter,
    FileRouter,
    ChatRouter,
]);

app.use(errorHandlerMiddleware);

(async() => {
    await databaseConnection();
    server.listen(CUSTOM_SERVER_PORT, () => {
        console.log(`started at: ${CUSTOM_SERVER_PORT}`);
    });
})();