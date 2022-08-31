import { socket } from '@utils';



interface IRoomEmitters {
    subscribe: (roomId: string) => void;
    unsubscribe: (roomId: string) => void;
}

export const RoomEmitters: IRoomEmitters = {
    subscribe(roomId) {
        socket.socketEntity.emit('subscribeOnRoom', roomId);
    },
    unsubscribe(roomId) {
        socket.socketEntity.emit('unsubscribeFromRoom', roomId);
    },
};