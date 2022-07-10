import {Socket as SocketIOType} from 'socket.io';
import { socket } from '..';



interface IUser {
    name: string;
}

interface IUsersOnline {
    users: IUser[],
    addUser: (user: IUser) => void;
    removeUser: (user: IUser) => void;
}

const usersOnline: IUsersOnline = {
    users: [],

    addUser(user) {
        if (usersOnline.users.some((item) => item.name === user.name)) return;
        usersOnline.users.push({name: user.name});
    },
    
    removeUser(user) {
        if (!usersOnline.users.some((item) => item.name === user.name)) return;
        usersOnline.users = usersOnline.users.filter((item) => item.name !== user.name); 
    },
};

export const initListeners = (socketIO: SocketIOType) => {
    console.log('connected ' + socketIO.id);
    usersOnline.addUser({name: socketIO.id});
    socket.events
        .getUsersOnline(usersOnline.users)
        .wentOnline({name: socketIO.id});

    socketIO.on('disconnect', () => {
        console.log('user disconnected ' + socketIO.id);
        usersOnline.removeUser({name: socketIO.id});
        socket.events.wentOffline({name: socketIO.id});
    });

    // handleMessage(socket, io)
};