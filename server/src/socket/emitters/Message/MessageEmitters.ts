import { io } from '@server';
import { IMessage } from '@types';



export const messageEmitters = {
    sendMessageSubscription({ to, message }: {to: string | string[], message: IMessage}) {
        io.to(to).emit('sendMessageSubscription', message);
    },

    removeMessageSubscription({ to, messageId }: {to: string | string[], messageId: string}) {
        io.to(to).emit('removeMessageSubscription', messageId);
    },
};