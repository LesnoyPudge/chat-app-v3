import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';



export const privateChannelListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnPrivateChannel', (privateChannelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.privateChannels.subscribe({ entityId: privateChannelId, userId: id });
    });

    socketIO.on('unsubscribeFromPrivateChannel', (privateChannelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.privateChannels.unsubscribe({ entityId: privateChannelId, userId: id });
    });
};