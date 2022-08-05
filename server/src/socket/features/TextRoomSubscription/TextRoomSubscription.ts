import { TextRoomService } from '@services';
import { socket } from '@socket';
import { ITextRoom } from '@types';



interface ITextRoomEntity extends ITextRoom {
    subscribers: Set<string>;
}

interface ITextRoomEntities {
    [id: string]: ITextRoomEntity;
}

interface ITextRoomSubscription {
    textRooms: ITextRoomEntities,
    subscribe: ({ userId, textRoomId }: {userId: string, textRoomId: string}) => void;
    unsubscribe: ({ userId, textRoomId }: {userId: string, textRoomId: string}) => void;
    update: ({ userId, textRoom }: {userId: string, textRoom: ITextRoom}) => void;
}

export const TextRoomSubscription: ITextRoomSubscription = {
    textRooms: {},

    async subscribe({ userId, textRoomId }) {
        console.log(userId + ' subscribed on textRoom: ' + textRoomId);
        try {
            const isExist = isTextRoomEntityExist(textRoomId);
            if (!isExist) {
                const target = await TextRoomService.getOne({ userId, textRoomId });
                createTextRoomEntity(target);
            } 

            subscribeOn({ textRoomId, userId });
            sendTextRoomEntity({ textRoomId, to: userId });
        } catch (error) {
            console.log('error during subscribe: ', error);
        }
    },

    unsubscribe({ userId, textRoomId }) {
        console.log(userId + ' unsubscribed from textRoom: ' + textRoomId);
        const isExist = isTextRoomEntityExist(textRoomId);
        if (!isExist) return;

        unsubscribeFrom({ userId, textRoomId });
        deleteUserTextRoom(textRoomId);
    },

    update({ userId, textRoom }) {
        console.log('textRoom:', textRoom.id, 'updated by:', userId);
        const isExist = isTextRoomEntityExist(textRoom.id);
        if (!isExist) {
            createTextRoomEntity(textRoom);
            // subscribeOn({ textRoomId: textRoom.id, userId });
            return;
        }

        updateTextRoomEntity(textRoom);
        const subscribers = getSubscribersArray(textRoom.id);
        sendTextRoomEntity({ textRoomId: textRoom.id, to: subscribers });
    },
};

const isTextRoomEntityExist = (textRoomId: string) => {
    return !!TextRoomSubscription.textRooms[textRoomId];
};

const createTextRoomEntity = (textRoom: ITextRoom) => {
    if (isTextRoomEntityExist(textRoom.id)) return;

    TextRoomSubscription.textRooms[textRoom.id] = {
        ...textRoom,
        subscribers: new Set(),
    };
};

const subscribeOn = ({ textRoomId, userId }: {textRoomId: string, userId: string}) => {
    if (!isTextRoomEntityExist(textRoomId)) return;
    
    TextRoomSubscription.textRooms[textRoomId].subscribers.add(userId);
    console.log('subscribers count:', TextRoomSubscription.textRooms[textRoomId].subscribers.size);
};

const unsubscribeFrom = ({ textRoomId, userId }: {textRoomId: string, userId: string}) => {
    if (!isTextRoomEntityExist(textRoomId)) return;

    TextRoomSubscription.textRooms[textRoomId].subscribers.delete(userId);
};

const deleteUserTextRoom = (textRoomId: string) => {
    if (!isTextRoomEntityExist(textRoomId)) return;

    const target = TextRoomSubscription.textRooms[textRoomId];
    const isZeroSubscribers = target.subscribers.size === 0;
    console.log('subscribers left:', target.subscribers.size);
    if (isZeroSubscribers) delete TextRoomSubscription.textRooms[textRoomId];
};

const sendTextRoomEntity = ({ textRoomId, to }: {textRoomId: string, to: string | string[]}) => {
    console.log('textRoom entity send to:', to);
    
    socket.events.sendTextRoomSubscription({ 
        to, 
        textRoom: TextRoomSubscription.textRooms[textRoomId], 
    });
};

const updateTextRoomEntity = (textRoom: ITextRoom) => {
    if (!isTextRoomEntityExist(textRoom.id)) return;
    TextRoomSubscription.textRooms[textRoom.id] = Object.assign(TextRoomSubscription.textRooms[textRoom.id], textRoom);
};

const getSubscribersArray = (textRoomId: string) => {
    return Array.from(TextRoomSubscription.textRooms[textRoomId].subscribers);
};