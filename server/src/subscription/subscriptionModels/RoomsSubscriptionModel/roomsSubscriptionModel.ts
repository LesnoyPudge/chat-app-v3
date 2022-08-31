import { RoomService } from '@services';
import { socket } from '@socket';
import { IRoom } from '@types';
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

const entityKey = 'rooms';

export const roomsSubscriptionModel: ISubscriptionModel<IRoom> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const room = await RoomService.getOne({ roomId: entityId, userId });
                addRoomEntity({ room });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendRoomEntity({ entityId, to: userId });
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
        sendRoomEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeRoomSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addRoomEntity = ({ room }: {room: IRoom}) => {
    roomsSubscriptionModel.entityList[room.id] = {
        info: {
            ...room,
        },
        subscribers: new Map(),
    };
};

const sendRoomEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendRoomSubscription({
        to,
        room: roomsSubscriptionModel.entityList[entityId].info,
    });
};

const removeRoomSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeRoomSubscription({
        to,
        roomId: entityId,
    });
};