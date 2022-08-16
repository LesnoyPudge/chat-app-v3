import { socket } from '@utils';



interface IPrivateChannelEmitters {
    subscribe: (privateChannelId: string) => void;
    unsubscribe: (privateChannelId: string) => void;
}

export const PrivateChannelEmitters: IPrivateChannelEmitters = {
    subscribe(privateChannelId) {
        socket.socketEntity.emit('subscribeOnPrivateChannel', privateChannelId);
    },
    unsubscribe(privateChannelId) {
        socket.socketEntity.emit('unsubscribeFromPrivateChannel', privateChannelId);
    },
};