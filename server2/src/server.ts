import './env';
import http from 'http';
import { databaseConnection } from '@database';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CUSTOM_CLIENT_URL,
}));

// app.use(paramsToBodyMiddleware);

// app.use([
//     UserRouter,
//     ChannelRouter,
//     RoomRouter,
//     PrivateChannelRouter,
//     MessageRouter,
//     RoleRouter,
//     FileRouter,
// ]);

// app.use(errorHandlerMiddleware);

const main = async() => {
    await databaseConnection();

    server.listen(process.env.CUSTOM_SERVER_PORT, () => {
        console.log(`started at: ${process.env.CUSTOM_SERVER_PORT}`);
    });
};

main();