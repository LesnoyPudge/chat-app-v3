import { AuthorizedSocketType } from '@socket';
import { subscription } from '@subscription';



export const textRoomListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnTextRoom', (textRoomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.textRooms.subscribe({ entityId: textRoomId, userId: id });
    });

    socketIO.on('unsubscribeFromTextRoom', (textRoomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        subscription.textRooms.unsubscribe({ entityId: textRoomId, userId: id });
    });
};