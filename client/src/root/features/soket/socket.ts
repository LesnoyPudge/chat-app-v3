import { SocketClientEvents, SocketServerEvents } from '@shared';
import { getEnv } from '@utils';
import { Socket, io } from 'socket.io-client';



export const socketIO = io(
    getEnv().CUSTOM_SERVER_URL,
    { autoConnect: true },
) as Socket<
    SocketServerEvents,
    SocketClientEvents
>;