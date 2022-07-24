import { socketIO } from '../../socket';



interface IUserEmitters {
    joinRooms: (rooms: string[] | string) => void;
    subscribe: (args: {userId: string, targetId: string}) => void;
    unsubscribe: (args: {userId: string, targetId: string}) => void;
    connectToVoiceRoom: (args: {userId: string}) => void;
}

export const UserEmitters: IUserEmitters = {
    joinRooms(rooms) {
        socketIO.emit('join_rooms', rooms);
    },
    subscribe({ userId, targetId }) {
        socketIO.emit('subscribe', { userId, targetId });
    },
    unsubscribe({ userId, targetId }) {
        socketIO.emit('unsubscribe', { userId, targetId });
    },
    connectToVoiceRoom({ userId }) {
        socketIO.emit('connectToVoiceRoom', userId);
    },
};