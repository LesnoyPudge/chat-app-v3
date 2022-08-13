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

export const textRoomsSubscriptionModel: ISubscriptionModel<ITextRoom> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey: 'textRooms' });
            if (!isExist) {
                const textRoom = await TextRoomService.getOne({ textRoomId: entityId, userId });
                addTextRoomEntity({ textRoom });
            } 

            subscribeOn({ entityId, entityKey: 'textRooms', userId });
            sendTextRoomEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscribe:', error);
        }
    },

    unsubscribe({ entityId, userId }) {
        console.log(userId, 'unsubscribed from', entityId);
        const isExist = isEntityExist({ entityId, entityKey: 'textRooms' });
        if (!isExist) return;

        unsubscribeFrom({ entityId, entityKey: 'textRooms', userId });
        deleteEntity({ entityId, entityKey: 'textRooms' });
    },

    update({ entity, userId }) {
        console.log(userId + ' make an update');
        const isExist = isEntityExist({ entityId: entity.id, entityKey: 'textRooms' });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey: 'textRooms', newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey: 'textRooms' });
        sendTextRoomEntity({ entityId: entity.id, to: subscribers });
    },
};

const addTextRoomEntity = ({ textRoom }: {textRoom: ITextRoom}) => {
    textRoomsSubscriptionModel.entityList[textRoom.id] = {
        info: {
            ...textRoom,
        },
        subscribers: {},
    };
};

const sendTextRoomEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendTextRoomSubscription({
        to,
        textRoom: textRoomsSubscriptionModel.entityList[entityId].info,
    });
};