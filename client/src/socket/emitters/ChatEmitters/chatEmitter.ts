import { Socket } from 'socket.io-client';



export interface IChatEvents {
    sendMessage: (message: string) => IChatEvents;
}

type ChatEmitterType = (socket: Socket) => IChatEvents;

export const chatEmitter: ChatEmitterType = (socket) => {
    const events: IChatEvents = {
        sendMessage: (message) => {
            socket.emit('send_message', message);
            return {
                ...events,
            };
        },
    };
    return {
        ...events,
    };
};