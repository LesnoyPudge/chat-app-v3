import './env';
import http from 'http';
import { databaseConnection, UserModel } from '@database';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnv } from '@utils';
import { ChannelRouter } from '@routers';
import { authorizationMiddleware, errorMiddleware } from '@middlewares';
import { User } from '../../shared/types';



const app = express();
const server = http.createServer(app);

const {
    CUSTOM_CLIENT_URL,
    CUSTOM_SERVER_PORT,
} = getEnv();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CUSTOM_CLIENT_URL,
}));

// app.use(paramsToBodyMiddleware);

const UserRouter = Router();

UserRouter.post(
    '/api/v1/user/action',
    // authorizationMiddleware,
    (req, res, next) => {
        console.log('action');
        UserModel.create({
            avatar: 'avatarId',            
            username: 'cool',
            password: 'pass',
            login: `qwe ${Math.random()}`,
        }).then((val) => {
            console.log((JSON.parse(JSON.stringify(val)) as User).createdAt);
            res.json(val);
        }); 
    },
);

UserRouter.post(
    '/api/v1/user/login',
    (req, res, next) => {
        console.log('login');
        res.send('login');
    },
);

UserRouter.post(
    '/api/v1/user/registration',
    (req, res, next) => {
        console.log('registration');
        res.send('registration');
    },
);

UserRouter.post(
    '/api/v1/user/refresh',
    (req, res, next) => {
        console.log('refresh');
        res.send('refresh');
    },
);

app.use([
    UserRouter,
    ChannelRouter,
//     RoomRouter,
//     PrivateChannelRouter,
//     MessageRouter,
//     RoleRouter,
//     FileRouter,
]);

app.use(errorMiddleware);

const main = async() => {
    await databaseConnection();

    server.listen(CUSTOM_SERVER_PORT, () => {
        console.log(`started at: ${CUSTOM_SERVER_PORT}`);
    });
};

main();