import { Server } from 'socket.io';
import http from 'http';
import { initListeners } from './listeners';
import { IInitEmitters, initEmitters } from './emitters';
import { getEnvVars } from '../utils';



export class Socket {
    private _io: Server;
    events: IInitEmitters;

    constructor(server: http.Server) {
        this._io = new Server(server, {
            cors: {
                origin: getEnvVars().CLIENT_URL,
                methods: ['GET', 'POST'],
            },
        });
        this.events = initEmitters(this._io);
    }

    listen() {
        this._io.on('connection', initListeners);
    }
}


const obj = {
    wow: 'wqe',
    qwe: 'wow',
};

function qwe(...args: any) {
    return args;
}

qwe(...[obj]);