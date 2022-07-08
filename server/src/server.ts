import cors from 'cors';
import express from 'express';
import path from 'path';
import http from 'http';
import { routesInit } from './routes';
import { Socket } from './socket';
import { dbConnect } from './models';
import { getEnvVars } from './utils';



const app = express();
const server = http.createServer(app);
export const socket = new Socket(server);
const { SERVER_PORT, CLIENT_URL, NODE_ENV } = getEnvVars();

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

(function() {
    try {
        socket.listen();
        routesInit(app);
        dbConnect();
        server.listen(SERVER_PORT, () => console.log(`Server started at: ${SERVER_PORT}`));
    } catch (error) {
        console.log('Error: ' + error);
        throw new Error();
    }
})();