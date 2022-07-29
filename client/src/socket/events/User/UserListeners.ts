import { IUser } from '@backendTypes';
import { reciveSubscription, store } from '@redux';
import { io } from '@socket';
import { log } from '@utils';



export const UserListeners = () => {
    io.on('sendSubscriptionUpdate', (user: IUser) => {
        store.dispatch(reciveSubscription(user));
        log('got subscription update: ', user);
    });

    io.on('getSubscription', (user: IUser) => {
        store.dispatch(reciveSubscription(user));
        log('subscribed and get data: ', user);
    });
};