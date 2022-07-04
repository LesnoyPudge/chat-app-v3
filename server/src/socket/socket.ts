import {Server, Socket as SocketType} from 'socket.io';
import config from 'config';
import http from 'http';



let mySocket: SocketType;

export class Socket {
    io: Server;
    events: ISocketEvents;

    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: config.get('clientUrl'),
                methods: ['GET', 'POST'],
            },
        });
        this.events = SocketEvents(this.io);
    }

    listen() {
        this.io.on('connection', (socket) => {
            console.log('connected ' + socket.id);
            mySocket = socket;
        
            socket.on('disconnect', () => {
                console.log('user disconnected ' + socket.id);
            });
        
            // socket.on('send message', (message: string) => {
            //     mySocket = socket;
            //     this.events.sendMessage(message);
            // });
        }); 
    }
}

interface ISocketEvents {
    sendMessage: (message: string) => void;
}

const SocketEvents = (io: Server): ISocketEvents => {
    return {
        sendMessage(message) {
            console.log('Event: send message, content: ', message, ' mySocket: ', mySocket.id);
            io.emit('chat message', message);
            // mySocket.broadcast.emit('chat message', message);
        },
    };
};