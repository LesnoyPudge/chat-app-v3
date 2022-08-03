import { AuthorizedSocketType } from 'src/socket/socket';
import { subscription } from '../../features';



export const subscriptionListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribe', (targetId) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.subscribe({ userId: id, targetId });
    });

    socketIO.on('unsubscribe', (targetId) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.unsubscribe({ userId: id, targetId });
    });
};