import { io } from '@server';
import { IUserPreview } from '@types';



export const userEmitters = {
    sendUserSubscription({ to, user }: {to: string | string[]; user: IUserPreview}) {
        io.to(to).emit('sendUserSubscription', user);
    },

    removeUserSubscription({ to, userId }: {to: string | string[], userId: string}) {
        io.to(to).emit('removeUserSubscription', userId);
    },
};