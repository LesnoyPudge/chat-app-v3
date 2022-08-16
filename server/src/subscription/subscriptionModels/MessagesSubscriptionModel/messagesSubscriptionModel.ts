import { MessageService } from '@services';
import { socket } from '@socket';
import { IMessage } from '@types';
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

export const messagesSubscriptionModel: ISubscriptionModel<IMessage> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey: 'messages' });
            if (!isExist) {
                const message = await MessageService.getOne({ messageId: entityId, userId });
                addMessageEntity({ message });
            } 

            subscribeOn({ entityId, entityKey: 'messages', userId });
            sendMessageEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscribe:', error);
        }
    },

    unsubscribe({ entityId, userId }) {
        console.log(userId, 'unsubscribed from', entityId);
        const isExist = isEntityExist({ entityId, entityKey: 'messages' });
        if (!isExist) return;

        unsubscribeFrom({ entityId, entityKey: 'messages', userId });
        deleteEntity({ entityId, entityKey: 'messages' });
    },

    update({ entity }) {
        const isExist = isEntityExist({ entityId: entity.id, entityKey: 'messages' });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey: 'messages', newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey: 'messages' });
        sendMessageEntity({ entityId: entity.id, to: subscribers });
    },
};

const addMessageEntity = ({ message }: {message: IMessage}) => {
    messagesSubscriptionModel.entityList[message.id] = {
        info: {
            ...message,
        },
        subscribers: {},
    };
};

const sendMessageEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendMessageSubscription({
        to,
        message: messagesSubscriptionModel.entityList[entityId].info,
    });
};