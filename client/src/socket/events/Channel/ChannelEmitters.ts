import { socket } from '@socket';



interface IChannelEmitters {
    subscribe: (targetId: string) => void;
    unsubscribe: (targetId: string) => void;
}

export const ChannelEmitters: IChannelEmitters = {
    subscribe(targetId) {
        socket.emit('subscribeOnChannel', targetId);
    },
    unsubscribe(targetId) {
        socket.emit('unsubscribeFromChannel', targetId);
    },
};