import { Socket } from 'socket.io-client';
import { userListeners } from './User';



export const eventListener = (socket: Socket) => {
    userListeners(socket);
};