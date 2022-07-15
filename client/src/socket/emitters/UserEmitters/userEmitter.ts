import { Socket } from 'socket.io-client';



interface ISubscribe {
    userId: string;
    targetId: string;
}

interface IUnsubscribe {
    userId: string;
    targetId: string;
}

export interface IUserEvents {
    joinRooms: (rooms: string[] | string) => IUserEvents;
    subscribe: (args: ISubscribe) => IUserEvents;
    unsubscribe: (args: IUnsubscribe) => IUserEvents;
}

type UserEmitterType = (socket: Socket) => IUserEvents;

export const userEmitter: UserEmitterType = (socket) => {
    const events: IUserEvents = {
        joinRooms: (rooms) => {
            socket.emit('join_rooms', rooms);
            return {
                ...events,
            };
        },
        subscribe: ({ userId, targetId }) => {
            console.log('works?');
            socket.emit('subscribe', { userId, targetId });
            return {
                ...events,
            };
        },
        unsubscribe: ({ userId, targetId }) => {
            socket.emit('unsubscribe', { userId, targetId });
            return {
                ...events,
            };
        },
    };
    return {
        ...events,
    };
};