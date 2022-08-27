import { TextRoomService } from '@services';
import { socket } from '@socket';
import { ITextRoom } from '@types';
import { ISubscriptionModel } from '@subscription';
import { subscriptionHelpers } from '@subscription/helpers';



const { 
    isEntityExist, 
    subscribeOn, 
    unsubscribeFrom,
    getSubscribersArray,
    deleteEntity,
    updateEntity,
} = subscriptionHelpers;

const entityKey = 'textRooms';

export const textRoomsSubscriptionModel: ISubscriptionModel<ITextRoom> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const textRoom = await TextRoomService.getOne({ textRoomId: entityId, userId });
                addTextRoomEntity({ textRoom });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendTextRoomEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscription:', error);
        }
    },

    unsubscribe({ entityId, userId }) {
        console.log(userId, 'unsubscribed from', entityId);
        const isExist = isEntityExist({ entityId, entityKey });
        if (!isExist) return;

        unsubscribeFrom({ entityId, entityKey, userId });
        deleteEntity({ entityId, entityKey });
    },

    update({ entity }) {
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey, newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey });
        sendTextRoomEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeTextRoomSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addTextRoomEntity = ({ textRoom }: {textRoom: ITextRoom}) => {
    textRoomsSubscriptionModel.entityList[textRoom.id] = {
        info: {
            ...textRoom,
        },
        subscribers: new Map(),
    };
};

const sendTextRoomEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendTextRoomSubscription({
        to,
        textRoom: textRoomsSubscriptionModel.entityList[entityId].info,
    });
};

const removeTextRoomSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeTextRoomSubscription({
        to,
        textRoomId: entityId,
    });
};