import { io as socketIO } from 'socket.io-client';
import { getEnv, log } from '@utils';
import { UserListeners, UserEmitters, ChannelEmitters } from './events';



// export const socketIO = io(getEnv().REACT_APP_WS_SERVER);

// export const socket = () => {
//     const connect = () => {
//         socketIO.connect();
//     };

//     const disconnect = () => {
//         socketIO.disconnect();
//     };

//     const emitters = {
//         user: UserEmitters,
//     };

//     const listeners = {
//         user: UserListeners,
//     };

//     return {
//         connect,
//         disconnect,
//         emitters,
//         // listeners,
//     };
// };

export const io = socketIO(getEnv().REACT_APP_WS_SERVER);

export const socket = {
    user: UserEmitters,
    channel: ChannelEmitters,
};

const initListeners = () => {
    UserListeners();
};

io.on('connect', () => {
    log('socket connected');
    initListeners();
});
io.on('disconnect', () => log('socket disconnected'));