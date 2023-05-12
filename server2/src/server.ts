import './env';
import http from 'http';
import { databaseConnection } from '@database';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getEnv } from '@utils';



const app = express();
const server = http.createServer(app);

const {
    CUSTOM_CLIENT_URL,
    CUSTOM_SERVER_PORT,
    CUSTOM_API_V1_URL,
} = getEnv();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: CUSTOM_CLIENT_URL,
}));

// app.use(paramsToBodyMiddleware);
export const UserRouter = Router();

UserRouter.post(
    CUSTOM_API_V1_URL + '/users/auth/registration',
    // UserValidator.registration,
    // controllerContainer(UserController.registration),
    (req, res) => {
        console.log('body', req.body);
        res.send('hello');
    },
);

app.use(UserRouter);
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

    server.listen(CUSTOM_SERVER_PORT, () => {
        console.log(`started at: ${CUSTOM_SERVER_PORT}`);
    });
};

main();