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
import { Override, Prettify, SocketAuth, Tokens } from '@shared';
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
});

socketServer.use((socket, next) => {
    const auth = socket.handshake.auth as Partial<SocketAuth>;
    if (!auth.accessToken) return next(ApiError.unauthorized());
            
    const data = token.validateAccessToken(auth.accessToken);
    if (!data) return next(ApiError.unauthorized());

    auth.data = data;

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