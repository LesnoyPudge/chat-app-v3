import { IUser } from '@backendTypes/*';
import { socketIO } from '../../socket';



type CallbackType<F> = (args: F) => void;

export const UserListeners = {
    sendSubscriptionUpdate(cb: CallbackType<IUser>) {
        socketIO.on('sendSubscriptionUpdate', (user: IUser) => {
            cb(user);
        });
    },
    getSubscription(cb: CallbackType<IUser>) {
        socketIO.on('getSubscription', (user: IUser) => {
            cb(user);
        });
    },
    connectToVoiceRoom(cb: CallbackType<{userId: string}>) {
        socketIO.on('reciveConnectionToVoiceRoom', (userId: string) => {
            cb({ userId });
        });
    },
};

// export const UserListeners = () => {
//     socketIO.on('sendSubscriptionUpdate', (user: IUser) => {
//         // reciveSubscription(user)
//         console.log(store.getState());
//         console.log('got subscription update: ', user);
//     });

//     socketIO.on('getSubscription', (user: IUser) => {
//         console.log(store.getState());
//         // store.dispatch(reciveSubscription(user));
//         console.log('subscribed and get data: ', user);
//     });
// };