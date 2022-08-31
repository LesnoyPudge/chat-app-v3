import { io } from '@server';
import { IRoom } from '@types';



export const roomEmitters = {
    sendRoomSubscription({ to, room }: {to: string | string[], room: IRoom}) {
        io.to(to).emit('sendRoomSubscription', room);
    },

    removeRoomSubscription({ to, roomId }: {to: string | string[], roomId: string}) {
        io.to(to).emit('removeRoomSubscription', roomId);
    },
};