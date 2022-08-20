import cors from 'cors';
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
// import { ExpressPeerServer } from 'peer';
import { routesInit } from './routes';
import { getEnv } from '@utils';
import { Server } from 'socket.io';
import { socket } from '@socket';



const { 
    CUSTOM_SERVER_PORT, 
    CUSTOM_CLIENT_URL,
    DB_CONNECTION_URL,
} = getEnv();
export const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: CUSTOM_CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});
// const peerServer = ExpressPeerServer(server, {
//     proxied: true,
//     // debug: true,
//     path: '/myapp',
//     port: 6000,
//     // ssl: {},
// });

// app.use('/peerjs', peerServer);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CUSTOM_CLIENT_URL,
}));

// if (CUSTOM_NODE_ENV === 'production') {
//     app.use('/', express.static(path.join(__dirname, '../../client', 'build')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
//     });
// }

const dbConnection = async() => {
    // mongoose.set('debug', true);
    await mongoose.connect(DB_CONNECTION_URL).then(() => {
        console.log('database connected');
    }).catch((error) => {
        throw new Error(`database connection failed: ${error.message}`);
    });
};

(async function() {
    try {
        socket.listen();
        routesInit(app);
        await dbConnection();
        server.listen(CUSTOM_SERVER_PORT, () => console.log(`Server started at: ${CUSTOM_SERVER_PORT}`));
    } catch (error) {
        throw new Error(error.message);
    }
})();