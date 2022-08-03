import { IChannel } from '@types';
import { io } from '../../../server';



export const channelEmitters = {
    sendSubscriptionUpdateFromChannel({ to, channel }: {to: string | string[], channel: IChannel}) {
        io.to(to).emit('sendSubscriptionUpdateFromChannel', channel);
    },

    getSubscriptionFromChannel({ to, channel }: {to: string | string[], channel: IChannel}) {
        io.to(to).emit('getSubscriptionFromChannel', channel);
    },
};