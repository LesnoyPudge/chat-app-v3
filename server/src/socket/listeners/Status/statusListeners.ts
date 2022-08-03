import { AuthorizedSocketType } from 'src/socket/socket';
import { IUser } from '../../../types';
import { subscription } from '../../features';



export const statusListeners = (socketIO: AuthorizedSocketType) => {
    socketIO.on('wentOnline', (user: IUser) => {
        subscription.wentOnline(user);
    });

    socketIO.on('wentOffline', (userId: string) => {
        subscription.wentOffline(userId);
    });
};