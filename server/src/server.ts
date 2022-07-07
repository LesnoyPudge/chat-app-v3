import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import path from 'path';
import http from 'http';
import { routesInit } from './routes';
import { Socket } from './socket';
import { dbInit } from './models';



dotenv.config({debug: true, path: path.join(__dirname, '../../.env')});
const app = express();
const server = http.createServer(app);
export const socket = new Socket(server);
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    }),
);

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '../../client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
    });
}

(async function() {
    try {
        socket.listen();
        routesInit(app);
        dbInit();
        server.listen(PORT, () => console.log(`Server started at: ${PORT}`));
    } catch (error) {
        console.log('Error: ' + error);
        throw new Error();
    }
})();