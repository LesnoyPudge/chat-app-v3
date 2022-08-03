import { io } from 'socket.io-client';
import { getEnv, getLocalStorage, log } from '@utils';
import { UserEmitters, ChannelEmitters } from './events';



export const socket = io(getEnv().CUSTOM_WS_SERVER, {
    auth: {
        token: getLocalStorage().values.token,
    },
});

export const socketEvents = {
    user: UserEmitters,
    channel: ChannelEmitters,
};



const initListeners = () => {
    // UserListeners();
    // ChannelListeners();
};

socket.on('connect', () => {
    socket.on('getSubscription', (user: any) => {
        log('works?:', user.id);
    });
});
// io.on('disconnect', () => log('socket disconnected'));

// io.on('connect_error', (error: {message?: string, data?: string, name?: string}) => {
//     log('socket error:', {
//         message: error.message,
//         status: error.data,
//         name: error.name,
//     });
// });