import { Server } from 'socket.io';



export interface IInitEmitters {
    sendMessage: (message: string) => void;
}

export const initEmitters = (io: Server): IInitEmitters => {
    return {
        sendMessage(message) {
            console.log('Event: send message, content: ', message);
            io.emit('chat message', message);
        },
    };
};