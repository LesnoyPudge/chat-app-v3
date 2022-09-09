import { io, Socket } from 'socket.io-client';
import { getEnv, getLocalStorage } from '@utils';
import { UserEmitters, ChannelEmitters, RoomEmitters, MessageEmitters, PrivateChannelEmitters } from './EventsEmitters';



export type SocketType = Socket;

// const socketEntity: SocketType = io(getEnv().CUSTOM_WS_SERVER, {
//     auth: {
//         token: getLocalStorage().values.token,
//     },
// });

export const socket = {
    // socketEntity,
    // events: {
    //     user: UserEmitters,
    //     channel: ChannelEmitters,
    //     room: RoomEmitters,
    //     message: MessageEmitters,
    //     privateChannel: PrivateChannelEmitters,
    // },
};