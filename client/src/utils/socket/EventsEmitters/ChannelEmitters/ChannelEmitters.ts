import { socket } from '@utils';



interface IChannelEmitters {
    subscribe: (channelId: string) => void;
    unsubscribe: (channelId: string) => void;
}

export const ChannelEmitters: IChannelEmitters = {
    subscribe(channelId) {
        socket.socketEntity.emit('subscribeOnChannel', channelId);
    },
    unsubscribe(channelId) {
        socket.socketEntity.emit('unsubscribeFromChannel', channelId);
    },
};