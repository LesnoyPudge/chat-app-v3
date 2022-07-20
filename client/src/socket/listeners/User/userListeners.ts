import { Socket } from 'socket.io-client';
import { IUser } from '@backendTypes/*';



export const userListeners = (socket: Socket) => {
    socket.on('sendSubscriptionUpdate', (user: IUser) => {
        console.log('got subscription update: ', user);
    });

    socket.on('getSubscription', (user: IUser) => {
        console.log('subscribed and get data: ', user);
    });
};