import { io } from '../../../server';
import { IUser } from '../../../types';



interface ISendSubscriptionUpdate {
    to: string[];
    user: IUser;
}

interface IGetSubscription {
    to: string;
    user: IUser;
}

export const subscriptionEmitters = {
    sendSubscriptionUpdate({ to, user }: ISendSubscriptionUpdate) {
        io.to(to).emit('sendSubscriptionUpdate', user);
    },

    getSubscription({ to, user }: IGetSubscription) {
        console.log('subscription data send to: ' + to);
        io.to(to).emit('getSubscription', user);
    },
};