import { store } from 'src/redux';
import { reciveSubscription } from 'src/redux/features';
import { socket } from 'src/utils';



const { user } = socket().listeners;

export const socketListenersInit = () => {
    user.getSubscription((user) => {
        store.dispatch(reciveSubscription(user));
        console.log('subscribed and get data: ', user);  
    });

    user.sendSubscriptionUpdate((user) => {
        store.dispatch(reciveSubscription(user));
        console.log('got subscription update: ', user);
    });
};


// reciveSubscription(user)
//         console.log(store.getState());
//         console.log('got subscription update: ', user);
//     });

//     socketIO.on('getSubscription', (user: IUser) => {
//         console.log(store.getState());
//         // store.dispatch(reciveSubscription(user));
//         console.log('subscribed and get data: ', user);