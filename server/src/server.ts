import cors from 'cors';
import express from 'express';
import path from 'path';
import http from 'http';
import config from 'config';
import mongoose from 'mongoose';
import routesInit from './routes/routesInit';
import { Socket } from './socket/socket';



const app = express();
const server = http.createServer(app);
export const socket = new Socket(server);
const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: config.get('clientUrl'),
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
        await mongoose.connect(config.get('dbconnection'));
        mongoose.pluralize(null);
        routesInit(app);
        server.listen(PORT, () => console.log(`Server started at: ${PORT}`));
    } catch (error) {
        console.log('Error: ' + error);
        throw new Error();
    }
})();