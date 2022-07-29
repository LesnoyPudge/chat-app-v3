import { IUser } from '@backendTypes';
import { reciveChannelInfo, store } from '@redux';
import { io } from '@socket';
import { log } from '@utils';



export const ChannelListeners = () => {
    // io.on('sendSubscriptionUpdate', (user: IUser) => {
    //     // reciveSubscription(user)
    //     log(store.dispatch(reciveChannelInfo));
    //     log('got subscription update: ', user);
    // });

    // io.on('getSubscription', (user: IUser) => {
    //     log(store.getState());
    //     // store.dispatch(reciveSubscription(user));
    //     log('subscribed and get data: ', user);
    // });
};