import { Socket } from 'socket.io-client';



export const userListeners = (socket: Socket) => {
    socket.on('sendSubscriptionUpdate', (user: any) => {
        console.log('got subscription update: ', user);
    });

    socket.on('getSubscription', (user: any) => {
        console.log('subscribed and get data: ', user);
    });
};