import { Socket as SocketIOType } from 'socket.io';
import { IUser } from '../../../types';
import { subscription } from '../../features';



export const statusListeners = (socketIO: SocketIOType) => {
    socketIO.on('wentOnline', (user: IUser) => {
        subscription.wentOnline(user);
    });

    socketIO.on('wentOffline', (userId: string) => {
        subscription.wentOffline(userId);
    });
};