import { Server } from 'socket.io';
import { io } from '../../server';



export interface IEmitters {
    sendMessage: (message: string) => IEmitters;
    anotherEvent: () => IEmitters;
}

export const emitters: IEmitters = {
    sendMessage(message) {
        console.log('Event: send message, content: ', message);
        io.emit('chat message', message);
        return emitters;
    },
    anotherEvent() {
        console.log('another event works');
        return emitters;
    },
};