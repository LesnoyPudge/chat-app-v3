import { socket } from '@utils';



interface ITextRoomEmitters {
    subscribe: (textRoomId: string) => void;
    unsubscribe: (textRoomId: string) => void;
}

export const TextRoomEmitters: ITextRoomEmitters = {
    subscribe(textRoomId) {
        socket.socketEntity.emit('subscribeOnTextRoom', textRoomId);
    },
    unsubscribe(textRoomId) {
        socket.socketEntity.emit('unsubscribeFromTextRoom', textRoomId);
    },
};