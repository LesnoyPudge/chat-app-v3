import { IUser } from '@backendTypes';



type CallbackType<F> = (args: F) => void;

export const ChannelListeners = {
    
};

// export const UserListeners = () => {
//     socketIO.on('sendSubscriptionUpdate', (user: IUser) => {
//         // reciveSubscription(user)
//         log(store.getState());
//         log('got subscription update: ', user);
//     });

//     socketIO.on('getSubscription', (user: IUser) => {
//         log(store.getState());
//         // store.dispatch(reciveSubscription(user));
//         log('subscribed and get data: ', user);
//     });
// };