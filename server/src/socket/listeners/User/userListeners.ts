import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';
import { IUser } from '@types';



export const userListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnUser', (targetId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.users.subscribe({ entityId: targetId, userId: id });
    });

    socketIO.on('unsubscribeFromUser', (targetId) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.users.unsubscribe({ userId: id, entityId: targetId });
    });
};