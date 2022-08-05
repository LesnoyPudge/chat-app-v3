import { AuthorizedSocketType } from '@socket';
import { TextRoomSubscription } from 'src/socket/features';



export const textRoomListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('subscribeOnTextRoom', (textRoomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        TextRoomSubscription.subscribe({ textRoomId, userId: id });
    });

    socketIO.on('unsubscribeFromTextRoom', (textRoomId: string) => {
        const { id } = socketIO.handshake.auth.user;
        TextRoomSubscription.unsubscribe({ textRoomId, userId: id });
    });
};