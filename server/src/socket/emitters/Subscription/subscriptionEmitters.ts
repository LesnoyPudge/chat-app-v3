import { io } from '@server';
import { IUserWithStatus } from '@types';



export const subscriptionEmitters = {
    sendUserSubscription({ to, user }: {to: string | string[]; user: IUserWithStatus}) {
        io.to(to).emit('sendUserSubscription', user);
    },
};