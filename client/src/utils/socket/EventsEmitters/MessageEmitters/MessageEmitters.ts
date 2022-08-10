import { socket } from '@utils';



interface IMessageEmitters {
    subscribe: (messageId: string) => void;
    unsubscribe: (messageId: string) => void;
}

export const MessageEmitters: IMessageEmitters = {
    subscribe(messageId) {
        socket.socketEntity.emit('subscribeOnMessage', messageId);
    },
    unsubscribe(messageId) {
        socket.socketEntity.emit('unsubscribeFromMessage', messageId);
    },
};