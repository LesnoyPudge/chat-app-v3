import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';



export const roomListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnRoom', (roomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.rooms.subscribe({ entityId: roomId, userId: id });
    });

    socketIO.on('unsubscribeFromRoom', (roomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.rooms.unsubscribe({ entityId: roomId, userId: id });
    });
};