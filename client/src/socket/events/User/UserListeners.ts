import { IUser } from '@backendTypes';
import { reciveSubscription } from '@redux/features';
import { store } from '@redux/store';
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