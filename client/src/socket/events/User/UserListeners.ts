import { IUser } from '@backendTypes';
import { reciveSubscription, store } from '@redux';
import { io } from '@socket';
import { log } from '@utils';



// type CallbackType<F> = (args: F) => void;

// export const UserListeners = {
//     sendSubscriptionUpdate(cb: CallbackType<IUser>) {
//         io.on('sendSubscriptionUpdate', (user: IUser) => {
//             cb(user);
//         });
//     },
//     getSubscription(cb: CallbackType<IUser>) {
//         io.on('getSubscription', (user: IUser) => {
//             cb(user);
//         });
//     },
//     connectToVoiceRoom(cb: CallbackType<{userId: string}>) {
//         io.on('reciveConnectionToVoiceRoom', (userId: string) => {
//             cb({ userId });
//         });
//     },
// };

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