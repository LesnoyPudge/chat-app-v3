import { io } from '../../../server';
import { IUser } from '../../../types';



export const subscriptionEmitters = {
    sendUserSubscription({ to, user }: {to: string | string[]; user: IUser}) {
        io.to(to).emit('sendUserSubscription', user);
    },
};