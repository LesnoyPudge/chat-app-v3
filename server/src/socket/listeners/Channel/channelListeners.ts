import { AuthorizedSocketType } from '@socket';
import { ChannelSubscription } from '../../features';



export const channelListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnChannel', (channelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        ChannelSubscription.subscribe({ channelId, userId: id });
    });

    socketIO.on('unsubscribeFromChannel', (channelId: string) => {
        const { id } = socketIO.handshake.auth.user;
        ChannelSubscription.unsubscribe({ channelId, userId: id });
    });
};