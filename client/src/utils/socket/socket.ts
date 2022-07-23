import { io } from 'socket.io-client';
import { getEnv } from '../env';
import { UserListeners } from './events';
import { UserEmitters } from './events/User/UserEmitters';



export const socketIO = io(getEnv().REACT_APP_WS_SERVER);

export const socket = () => {
    const connect = () => {
        socketIO.connect();
    };

    const disconnect = () => {
        socketIO.disconnect();
    };

    const emitters = {
        user: UserEmitters,
    };

    const listeners = {
        user: UserListeners,
    };

    return {
        connect,
        disconnect,
        emitters,
        listeners,
    };
};

socketIO.on('connect', () => console.log('connected: ', socketIO.connected));
socketIO.on('disconnect', () => console.log('connected: ', socketIO.connected));