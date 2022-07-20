import { Socket as SocketIOType } from 'socket.io';
import { subscription } from '../../features';



interface ISubscribe {
    userId: string;
    targetId: string;
}

interface IUnsubscribe {
    userId: string;
    targetId: string;
}

export const subscriptionListeners = (socketIO: SocketIOType) => {
    socketIO.on('subscribe', ({ userId, targetId }: ISubscribe) => {
        subscription.subscribe(userId, targetId);
    });

    socketIO.on('unsubscribe', ({ userId, targetId }: IUnsubscribe) => {
        subscription.unsubscribe(userId, targetId);
    });
};