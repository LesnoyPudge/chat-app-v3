import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';



export const messageListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnMessage', (messageId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.messages.subscribe({ entityId: messageId, userId: id });
    });

    socketIO.on('unsubscribeFromMessage', (messageId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.messages.unsubscribe({ entityId: messageId, userId: id });
    });
};