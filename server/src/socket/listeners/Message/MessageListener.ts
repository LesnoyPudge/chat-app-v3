import { AuthorizedSocketType } from '@socket';
import { MessageSubscription } from 'src/socket/features';



export const messageListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnMessage', (messageId: string) => {
        const { id } = socketIO.handshake.auth.user;
        MessageSubscription.subscribe({ messageId, userId: id });
    });

    socketIO.on('unsubscribeFromMessage', (messageId: string) => {
        const { id } = socketIO.handshake.auth.user;
        MessageSubscription.unsubscribe({ messageId, userId: id });
    });
};