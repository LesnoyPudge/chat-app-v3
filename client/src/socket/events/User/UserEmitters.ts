


// interface IUserEmitters {
//     joinRooms: (rooms: string[] | string) => void;
//     subscribe: (args: {userId: string, targetId: string}) => void;
//     unsubscribe: (args: {userId: string, targetId: string}) => void;
//     connectToVoiceRoom: (args: {userId: string}) => void;
// }


// export const UserEmitters: IUserEmitters = {
//     joinRooms(rooms) {
//         socketIO.emit('join_rooms', rooms);
//     },
//     subscribe({ userId, targetId }) {
//         socketIO.emit('subscribe', { userId, targetId });
//     },
//     unsubscribe({ userId, targetId }) {
//         socketIO.emit('unsubscribe', { userId, targetId });
//     },
//     connectToVoiceRoom({ userId }) {
//         socketIO.emit('connectToVoiceRoom', userId);
//     },
// };


import { io } from '@socket';



type SocketEventListenerType<T> = (args: T) => void;

interface IUserEmitters {
    joinRooms: SocketEventListenerType<{rooms: string[] | string}>;
    subscribe: SocketEventListenerType<{userId: string, targetId: string}>;
    unsubscribe: SocketEventListenerType<{userId: string, targetId: string}>;
    connectToVoiceRoom: SocketEventListenerType<{userId: string}>;
}

export const UserEmitters: IUserEmitters = {
    joinRooms(rooms) {
        io.emit('join_rooms', rooms);
    },
    subscribe({ userId, targetId }) {
        io.emit('subscribe', { userId, targetId });
    },
    unsubscribe({ userId, targetId }) {
        io.emit('unsubscribe', { userId, targetId });
    },
    connectToVoiceRoom({ userId }) {
        io.emit('connectToVoiceRoom', userId);
    },
};