import { io } from '../../server';
import { subscriptionEmitters } from './Subscription/subscriptionEmitters';



// export interface IEmitters {
//     sendMessage: (message: string) => IEmitters;
//     anotherEvent: () => IEmitters;
//     getUsersOnline: (users: {name: string}[]) => IEmitters;
//     wentOnline: (user: {name: string}) => IEmitters;
//     wentOffline: (user: {name: string}) => IEmitters;
// }

export const emitters = {
    ...subscriptionEmitters,
    // sendMessage(message) {
    //     console.log('Event: send message, content: ', message);
    //     io.emit('chat message', message);
    //     return emitters;
    // },
    // anotherEvent() {
    //     console.log('another event works');
    //     return emitters;
    // },
    // getUsersOnline(users) {
    //     io.emit('get_online_users', users);
    //     return emitters;
    // },
    // wentOnline(user) {
    //     io.emit('went_online', user);
    //     return emitters;
    // },
    // wentOffline(user) {
    //     io.emit('went_offline', user);
    //     return emitters;
    // },
};