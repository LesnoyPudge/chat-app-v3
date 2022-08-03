import { socket } from '@socket';



interface IUserEmitters {
    joinRooms: (args: string[] | string) => void;
    subscribe: (args: string) => void;
    unsubscribe: (args: string) => void;
    connectToVoiceRoom: () => void;
}

export const UserEmitters: IUserEmitters = {
    joinRooms(rooms) {
        socket.emit('join_rooms', rooms);
    },
    subscribe(targetId) {
        socket.emit('subscribe', targetId);
    },
    unsubscribe(targetId) {
        socket.emit('unsubscribe', targetId);
    },
    connectToVoiceRoom() {
        socket.emit('connectToVoiceRoom');
    },
};