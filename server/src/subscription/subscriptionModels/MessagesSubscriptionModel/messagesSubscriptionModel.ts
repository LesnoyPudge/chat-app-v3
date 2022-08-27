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

const entityKey = 'messages';

export const messagesSubscriptionModel: ISubscriptionModel<IMessage> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const message = await MessageService.getOne({ messageId: entityId, userId });
                addMessageEntity({ message });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendMessageEntity({ entityId, to: userId });
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
        sendMessageEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeMessageSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addMessageEntity = ({ message }: {message: IMessage}) => {
    messagesSubscriptionModel.entityList[message.id] = {
        info: {
            ...message,
        },
        subscribers: new Map(),
    };
};

const sendMessageEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendMessageSubscription({
        to,
        message: messagesSubscriptionModel.entityList[entityId].info,
    });
};

const removeMessageSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeMessageSubscription({
        to,
        messageId: entityId,
    });
};