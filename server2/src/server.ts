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
import { ExpressPeerServer, PeerServer } from 'peer';
import { AuthorizedServer } from '@types';
import { METHOD, SocketAuth } from '@shared';



const {
    CUSTOM_CLIENT_URL,
    CUSTOM_SERVER_PORT,
    CUSTOM_API_V1_URL,
} = getEnv();

const app = express();
const server = http.createServer(app);


const socketServer = new Server(server, {
    cors: {
        origin: CUSTOM_CLIENT_URL,
        methods: [METHOD.POST, METHOD.GET],
    },
}) as AuthorizedServer;

socketServer.use((socket, next) => {
    const auth = socket.handshake.auth as SocketAuth;
    console.log('get socket message', auth);

    if (!auth.accessToken) return next(ApiError.unauthorized());

    const tokenData = token.validateAccessToken(auth.accessToken);
    if (!tokenData) return next(ApiError.unauthorized());

    socket.data = {
        ...tokenData,
        accessToken: auth.accessToken,
    };

    next();
});

export const sockets = new Sockets(socketServer);

const offer: object | null = null;
const offers: object[] = [];
const answers: object[] = [];

let connections: object[] = [];

(() => {
    sockets.server.on('connect', (socket) => {
        // const userId = socket.handshake.auth.id as string;

        // @ts-ignore
        socket.on('VoiceChat_join', (peerId) => {
            if (connections.length >= 2) {
                connections = [];
            }
            connections.push(peerId);
            connections = connections.filter(Boolean);
            // @ts-ignore
            sockets.server.emit('VoiceChat_data', connections);
        });

        // // @ts-ignore
        // socket.on('VoiceChat_offer', (receivedOffer: object) => {
        //     offer = receivedOffer;

        //     server.emit('VoiceChat_answer', receivedOffer);
        // });

        // // @ts-ignore
        // socket.on('VoiceChat_candidate', (offer: object) => {
        //     offers.push(offer);
        // });

        // // @ts-ignore
        // socket.on('VoiceChat_leave', (voiceChatId: string) => {

        // });

        // // @ts-ignore
        // socket.on('VoiceChat_subscribe', (voiceChatId: string) => {

        // });

        // // @ts-ignore
        // socket.on('VoiceChat_unsubscribe', (voiceChatId: string) => {

        // });
    });
})();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CUSTOM_CLIENT_URL,
}));

PeerServer({ port: 9000, path: `${CUSTOM_API_V1_URL}/peer` });

import {
    ChannelRouter, ChatRouter, FileRouter,
    MessageRouter, PrivateChannelRouter, RoleRouter,
    RoomRouter, UserRouter,
} from '@routers';



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