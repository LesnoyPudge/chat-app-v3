import { io } from '@server';
import { ApiError, token } from '@utils';
import { Socket } from 'socket.io';
import { IUser } from '@types';
import { channelEmitters, subscriptionEmitters, textRoomEmitters, userEmitters, messageEmitters } from './emitters';
import { channelListeners, messageListeners, userListeners, textRoomListeners } from './listeners';



export type AuthorizedSocketType = Socket & {
    handshake: {
        auth: {
            token: string;
            user: IUser;
        }
    }
}

export const socket = {
    listen() {
        io.use((socket: AuthorizedSocketType, next) => {
            const error = ApiError.unauthorized('unauthorized socket connection');
            const socketAuthorizationErorr = {
                message: error.message,
                name: error.name,
                data: error.status,
            };
            
            const authToken = socket.handshake.auth.token;
            if (!authToken) return next(socketAuthorizationErorr);
            
            const user = token.validateAccessToken(authToken);
            if (!user) return next(socketAuthorizationErorr);
            
            socket.handshake.auth.user = user;

            next();
        });
          
        io.on('connection', initListeners);
    },

    events: {
        ...userEmitters,
        ...subscriptionEmitters,
        ...channelEmitters,
        ...textRoomEmitters,
        ...messageEmitters,
    },
};

const initListeners = (socketIO: AuthorizedSocketType) => {
    console.log('connected ' + socketIO.id);
    

    socketIO.on('disconnect', () => {
        console.log('user disconnected ' + socketIO.id);
    });

    socketIO.on('join_rooms', (rooms: string[] | string) => {
        socketIO.join(rooms);
        console.log('joined to rooms: ', rooms);
    });

    socketIO.on('connectToVoiceRoom', (userId: string) => {
        console.log('user: ', userId, ' connected to voice room');
        socket.events.reciveConnectionToVoiceRoom(userId);
    });

    userListeners(socketIO);
    channelListeners(socketIO);
    textRoomListeners(socketIO);
    messageListeners(socketIO);
};