import { Socket as SocketIOType } from 'socket.io';
import { statusListeners } from './Status/statusListeners';
import { subscriptionListeners } from './Subscription/subscriptionListeners';



export const initListeners = (socketIO: SocketIOType) => {
    console.log('connected ' + socketIO.id);

    socketIO.on('disconnect', () => {
        console.log('user disconnected ' + socketIO.id);
    });

    socketIO.on('join_rooms', (rooms: string[] | string) => {
        socketIO.join(rooms);
        console.log('joined to rooms: ', rooms);
    });

    statusListeners(socketIO);
    subscriptionListeners(socketIO);
};