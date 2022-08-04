import { IChannel } from '@types';
import { io } from '../../../server';



export const channelEmitters = {
    sendChannelSubscription({ to, channel }: {to: string | string[], channel: IChannel}) {
        io.to(to).emit('sendChannelSubscription', channel);
    },
};