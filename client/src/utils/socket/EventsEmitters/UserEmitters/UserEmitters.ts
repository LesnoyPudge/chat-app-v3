import { socket } from '@utils';



interface IUserEmitters {
    joinRooms: (rooms: string[] | string) => void;
    subscribe: (targetId: string) => void;
    unsubscribe: (targetId: string) => void;
    connectToVoiceRoom: (voiceRoomId: string) => void;
}

export const UserEmitters: IUserEmitters = {
    joinRooms(rooms) {
        socket.socketEntity.emit('join_rooms', rooms);
    },
    subscribe(targetId) {
        socket.socketEntity.emit('subscribe', targetId);
    },
    unsubscribe(targetId) {
        socket.socketEntity.emit('unsubscribe', targetId);
    },
    connectToVoiceRoom(voiceRoomId) {
        socket.socketEntity.emit('connectToVoiceRoom', voiceRoomId);
    },
};