import {Socket} from 'socket.io';



export const initListeners = (socket: Socket) => {
    console.log('connected ' + socket.id);
    // handleDisconnect
    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
    });

    // handleMessage(socket, io)
};