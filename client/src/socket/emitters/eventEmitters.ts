import { Socket } from 'socket.io-client';
import { chatEmitter, IChatEvents } from './ChatEmitters';
import { userEmitter, IUserEvents } from './UserEmitters';



interface IEventEmitters {
    user: IUserEvents;
    chat: IChatEvents;
}
type EventEmittersType = (socket: Socket) => IEventEmitters;

export const eventEmitters: EventEmittersType = (socket) => {
    return { 
        user: userEmitter(socket),
        chat: chatEmitter(socket), 
    };
};