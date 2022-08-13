import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';



export const channelListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnChannel', (channelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.channels.subscribe({ entityId: channelId, userId: id });
    });

    socketIO.on('unsubscribeFromChannel', (channelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.channels.unsubscribe({ entityId: channelId, userId: id });
    });
};