import { IUser } from '@types';




interface IRoomSubscribers {
    [id: string]: IUser;
}

interface IRoomEntities {
    [id: string]: {
        id: string;
        subscribers: IRoomSubscribers;
    };
}

interface IVoiceRoomSubscription {
    rooms: IRoomEntities;
    subscribe: () => void;
    unsubscribe: () => void;
    update: () => void;
}

export const VoiceRoomSubscription: IVoiceRoomSubscription = {
    rooms: {},

    subscribe(): void {
        throw new Error('Function not implemented.');
    },

    unsubscribe(): void {
        throw new Error('Function not implemented.');
    },
    
    update(): void {
        throw new Error('Function not implemented.');
    },
};