import cookieParser from 'cookie-parser';
import mongoose, { Types, Document, Schema } from 'mongoose';
// import { ExpressPeerServer } from 'peer';
import { socket } from '@socket';
import { getEnv } from '@utils';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { routesInit } from './routes';



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

const dbConnection = async() => {
    // mongoose.set('debug', true);
    mongoose.set('strictQuery', true);
    // DB_CONNECTION_URL
    // mongodb://127.0.0.1:27017/ChatApp
    await mongoose.connect(DB_CONNECTION_URL).then(() => {
        console.log('database connected');
    }).catch((error) => {
        console.log(`database connection failed: ${error.message}`);
    });
};

(async function() {
    try {
        socket.listen();
        routesInit(app);
        await dbConnection();
        server.listen(CUSTOM_SERVER_PORT, () => {
            console.log(`Server started at: ${CUSTOM_SERVER_PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();