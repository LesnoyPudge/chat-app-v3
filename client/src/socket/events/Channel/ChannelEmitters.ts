import { io } from '@socket';



interface IChannelEmitters {
    subscribe: (args: {userId: string, targetId: string}) => void;
    unsubscribe: (args: {userId: string, targetId: string}) => void;
}

export const ChannelEmitters: IChannelEmitters = {
    subscribe({ userId, targetId }) {
        // io.emit('subscribe', { userId, targetId });
    },
    unsubscribe({ userId, targetId }) {
        // io.emit('unsubscribe', { userId, targetId });
    },
};