import { io } from '@server';
import { ApiError, token } from '@utils';
import { Socket } from 'socket.io';
import { IUser } from '@types';
import { channelEmitters, roomEmitters, userEmitters, messageEmitters, privateChannelEmitters, roleEmitters } from './emitters';
import { channelListeners, messageListeners, userListeners, roomListeners, privateChannelListeners } from './listeners';




export type AuthorizedSocketType = Socket & {
    handshake: {
        auth: {
            token: string;
            user: Partial<IUser>;
        }
    }
}

export const socket = {
    listen() {
        io.use((socket, next) => {
            const error = ApiError.unauthorized('unauthorized socket connection');
            const socketAuthorizationError = {
                message: error.message,
                name: error.name,
                data: error.status,
            };
            
            const authToken = (socket as AuthorizedSocketType).handshake.auth.token;
            if (!authToken) return next(socketAuthorizationError);
            
            const user = token.validateAccessToken(authToken);
            if (!user) return next(socketAuthorizationError);
            
            socket.handshake.auth.user = user;

            next();
        });
          
        io.on('connection', initListeners);
    },

    events: {
        ...userEmitters,
        ...channelEmitters,
        ...roomEmitters,
        ...messageEmitters,
        ...privateChannelEmitters,
        ...roleEmitters,
    },
};

const initListeners = (socketIO: Socket) => {
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
        // socket.events.reciveConnectionToVoiceRoom(userId);
    });

    userListeners(socketIO as AuthorizedSocketType);
    channelListeners(socketIO as AuthorizedSocketType);
    roomListeners(socketIO as AuthorizedSocketType);
    messageListeners(socketIO as AuthorizedSocketType);
    privateChannelListeners(socketIO as AuthorizedSocketType);
};