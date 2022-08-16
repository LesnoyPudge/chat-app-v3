import { io } from '@server';
import { ITextRoom } from '@types';



export const textRoomEmitters = {
    sendTextRoomSubscription({ to, textRoom }: {to: string | string[], textRoom: ITextRoom}) {
        io.to(to).emit('sendTextRoomSubscription', textRoom);
    },

    removeTextRoomSubscription({ to, textRoomId }: {to: string | string[], textRoomId: string}) {
        io.to(to).emit('removeTextRoomSubscription', textRoomId);
    },
};