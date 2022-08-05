import { io, Socket } from 'socket.io-client';
import { getEnv, getLocalStorage } from '@utils';
import { UserEmitters, ChannelEmitters, TextRoomEmitters } from './EventsEmitters';



export type SocketType = Socket;

const socketEntity: SocketType = io(getEnv().CUSTOM_WS_SERVER, {
    auth: {
        token: getLocalStorage().values.token,
    },
});

export const socket = {
    socketEntity,
    events: {
        user: UserEmitters,
        channel: ChannelEmitters,
        textRoom: TextRoomEmitters,
    },
};