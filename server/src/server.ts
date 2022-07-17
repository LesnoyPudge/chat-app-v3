import cors from 'cors';
import express from 'express';
import path from 'path';
import http from 'http';
import { routesInit } from './routes';
import { dbConnection } from './models';
import { getEnv } from './utils';
import { Server } from 'socket.io';
import { socket } from './socket';



const { SERVER_PORT, CLIENT_URL, NODE_ENV } = getEnv();
export const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL,
    }),
);

if (NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '../../client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
    });
}

(async function() {
    try {
        socket.listen();
        routesInit(app);
        await dbConnection();
        server.listen(SERVER_PORT, () => console.log(`Server started at: ${SERVER_PORT}`));
    } catch (error) {
        console.log('Error: ' + error);
        throw new Error();
    }
})();