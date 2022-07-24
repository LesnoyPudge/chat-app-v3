import { io } from '../../../server';



export const userEmitters = {
    reciveConnectionToVoiceRoom(userId: string) {
        io.to('123').emit('reciveConnectionToVoiceRoom', userId);
    },
};