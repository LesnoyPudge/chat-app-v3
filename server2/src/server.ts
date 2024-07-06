import '@total-typescript/ts-reset';
import './env';
import http from 'http';
import { databaseConnection } from '@database';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnv, isDev, token } from '@utils';
import { errorHandlerMiddleware } from '@middlewares';
import { Server } from 'socket.io';
import { ApiError } from '@errors';
import { Sockets } from './subscription/Sockets';
// import { ExpressPeerServer, PeerServer } from 'peer';
import { AuthorizedServer } from '@types';
import { METHOD, SocketAuth } from '@shared';



const {
    CUSTOM_CLIENT_URL,
    CUSTOM_SERVER_PORT,
    CUSTOM_API_V1_URL,
    CUSTOM_SERVER_URL,
    CUSTOM_NODE_ENV,
} = getEnv();

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGINS = isDev() ? [
    CUSTOM_CLIENT_URL,
    'https://nbp194pb-3000.euw.devtunnels.ms',
    'http://localhost',
    'http://172.27.192.1',
    'http://192.168.31.27',
] : CUSTOM_CLIENT_URL;

const socketServer = new Server(server, {
    cors: {
        // origin: CLIENT_ORIGINS,
        // methods: [METHOD.POST, METHOD.GET],
    },
    allowRequest(req, fn) {
        fn(null, true);
    },
}) as AuthorizedServer;

const {CUSTOM_CLIENT_ONLY} = getEnv()

socketServer.use((socket, next) => {
    const auth = socket.handshake.auth as Partial<SocketAuth>;
    // console.log('get socket message', auth);

    if (Number(CUSTOM_CLIENT_ONLY)) return next();

    if (!auth.accessToken) return next(ApiError.unauthorized());

    const tokenData = token.validateAccessToken(auth.accessToken);
    if (!tokenData) return next(ApiError.unauthorized());

    socket.data = {
        // id: '123',
        // email: null,
        // password: 'qwe',
        // accessToken: 'qwezxc',
        ...tokenData,
        accessToken: auth.accessToken,
    };

    next();
});

export const sockets = new Sockets(socketServer);

// setInterval(() => {
//     console.log(sockets.sockets);
// }, 2000);
// const offer: object | null = null;
// const offers: object[] = [];
// const answers: object[] = [];

// let connections: object[] = [];

type UserId = string;

(() => {
    const connectedUsers = new Map<UserId, {
        socketId: string;
        data: Record<string, unknown>
    }>();
    
    const getEntryBySocketId = (socketIdToFindBy: string) => Array.from(
        connectedUsers.entries()
    ).find(([_, {socketId}]) => {
        return socketId === socketIdToFindBy;
    })

    const intervalHandler = () => {
        console.log('data check:', Array.from(connectedUsers.entries()))
    }
    // intervalHandler()
    // setInterval(intervalHandler, 5000)

    const getSockets = () => {
        return Array.from(connectedUsers.values()).map((data) => data.socketId)
    }

    let tmpUsersPool: string[] = [];

    sockets.server.on('connect', (socket) => {
        // const userId = socket.handshake.auth.id as string;
        console.log('connected', socket.id);
        socket.join(socket.id);

        tmpUsersPool.push(socket.id);

        // @ts-expect-error
        socket.on('Conversation_offerFromClient', (offer: any) => {
            console.log(
                `offer incoming from ${socket.id}, send to`, 
                tmpUsersPool
            )
            // sockets.server.to(tmpUsersPool).
            socket.to(tmpUsersPool).emit(
                // @ts-expect-error
                'Conversation_incomingOffer',
                'test',
                offer
            )
        })

        // @ts-expect-error
        socket.on('Conversation_answerFromClient', (answer: any) => {
            // sockets.server.to(tmpUsersPool).
            console.log(
                `answer incoming from ${socket.id}, send to`, 
                tmpUsersPool
            )
            socket.to(tmpUsersPool).emit(
                // @ts-expect-error
                'Conversation_incomingAnswer',
                'test',
                answer
            )
        })

        // @ts-expect-error
        socket.on('Conversation_candidateFromClient', (candidate: any) => {
            console.log(
                `candidate incoming from ${socket.id}, send to`, 
                tmpUsersPool
            )
            socket.to(tmpUsersPool).emit(
                // @ts-expect-error
                'Conversation_incomingCandidate',
                'test',
                candidate
            )
        })
        
        const sendData = () => {
            console.log('send data to', getSockets())
            sockets.server.to(
                getSockets()
                // @ts-expect-error
            ).emit('Conversation_data', 'convId', {
                users: Array.from(connectedUsers.entries())
            })
        }

        // @ts-expect-error
        socket.on('Conversation_subscribe', (data: {
            userId: string;
            data: Record<string, unknown>
        }) => {
            console.log('sub', data.userId, socket.id)
            connectedUsers.set(data.userId, {
                data: data.data,
                socketId: socket.id,
            });
            sendData()
        })

        // @ts-expect-error
        socket.on('Conversation_unsubscribe', () => {
            const userEntry = getEntryBySocketId(socket.id);
            if (!userEntry) return;
            const [userId] = userEntry;
            console.log('unsub', userId, socket.id)
            connectedUsers.delete(userId);
            sendData()
        })

        socket.on('disconnect', () => {
            const userEntry = getEntryBySocketId(socket.id);
            tmpUsersPool = tmpUsersPool.filter((id) => id === socket.id)
            console.log('disc', userEntry)
            if (!userEntry) return;
            socket.leave(socket.id);
            connectedUsers.delete(userEntry[0]);
            sendData()
        })

        // @ts-ignore
        // socket.on('VoiceChat_join', (peerId) => {
        //     if (connections.length >= 2) {
        //         connections = [];
        //     }
        //     connections.push(peerId);
        //     connections = connections.filter(Boolean);
        //     // @ts-ignore
        //     sockets.server.emit('VoiceChat_data', connections);
        // });

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
// app.use(cors({
//     credentials: true,
//     origin: CLIENT_ORIGINS,
// }));

app.use(cors())

// PeerServer({ port: 9000, path: `${CUSTOM_API_V1_URL}/peer` });

import {
    ChannelRouter, ChatRouter, FileRouter,
    MessageRouter, PrivateChannelRouter, RoleRouter,
    RoomRouter, UserRouter, HelperRouter,
} from '@routers';
import { emails } from './emails/emails';


app.get('/', (req, res) => { 
    res.json("welcome to our server") 
});

app.use((req, res, next) => {
    console.log('Get request:', req.url);

    next();
});

app.use([
    UserRouter,
    ChannelRouter,
    RoomRouter,
    PrivateChannelRouter,
    MessageRouter,
    RoleRouter,
    FileRouter,
    ChatRouter,
    HelperRouter,
]);

app.use(errorHandlerMiddleware);


(async() => {
    await databaseConnection();
    const hostname = '192.168.31.27';
    // https://nbp194pb-5000.euw.devtunnels.ms/
    // const hostname = 'localhost'
    // const hostname = '0.0.0.0';
    const port = 5000;
    server.listen(port, hostname, () => {
        
        console.log(`started at: ${hostname}:${port}`);
    });
})();