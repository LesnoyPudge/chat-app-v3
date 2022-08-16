import { IPrivateChannel } from '@types';
import { io } from '@server';



export const privateChannelEmitters = {
    sendPrivateChannelSubscription({ to, privateChannel }: {to: string | string[], privateChannel: IPrivateChannel}) {
        io.to(to).emit('sendPrivateChannelSubscription', privateChannel);
    },

    removePrivateChannelSubscription({ to, privateChannelId }: {to: string | string[], privateChannelId: string}) {
        io.to(to).emit('removePrivateChannelSubscription', privateChannelId);
    },
};