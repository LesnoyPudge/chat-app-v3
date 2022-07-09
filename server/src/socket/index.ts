import { initListeners } from './listeners';
import { emitters } from './emitters';
import { io } from '../server';



export const Socket = {
    listen() {
        io.on('connection', initListeners);
    },
    events: emitters,
};