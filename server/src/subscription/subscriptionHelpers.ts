import { subscription } from './subscription';



type EntityKeyType = 'users' | 'channels' | 'rooms' | 'messages' | 'privateChannels';

interface ISubscriptionHelpers {
    isEntityExist: (args: {entityId: string, entityKey: EntityKeyType}) => boolean;
    subscribeOn: (args: {entityId: string, userId: string, entityKey: EntityKeyType}) => void;
    unsubscribeFrom: (args: {entityId: string, userId: string, entityKey: EntityKeyType}) => void;
    getSubscribersArray: (args: {entityId: string, entityKey: EntityKeyType}) => string[];
    deleteEntity: (args: {entityId: string, entityKey: EntityKeyType}) => void;
    updateEntity: <T extends Record<string, unknown>>(args: {
        entityId: string, 
        newValues: T, 
        entityKey: EntityKeyType
    }) => T & {id: string};
}

export const subscriptionHelpers: ISubscriptionHelpers = {
    isEntityExist({ entityId, entityKey }) {
        return !!subscription[entityKey].entityList[entityId];
    },

    subscribeOn({ entityId, userId, entityKey }) {
        const counter = subscription[entityKey].entityList[entityId].subscribers.get(userId);
        const newValue = counter ? counter + 1 : 1;
        subscription[entityKey].entityList[entityId].subscribers.set(userId, newValue);
    },

    unsubscribeFrom({ entityId, userId, entityKey }) {
        const counter = subscription[entityKey].entityList[entityId].subscribers.get(userId);

        if (counter && counter > 1) {
            return subscription[entityKey].entityList[entityId].subscribers.set(userId, counter - 1);
        }
        
        if (counter && counter === 1) {
            return subscription[entityKey].entityList[entityId].subscribers.delete(userId);
        }
    },

    getSubscribersArray({ entityId, entityKey }) {
        return [...subscription[entityKey].entityList[entityId].subscribers.keys()];
    },

    deleteEntity({ entityId, entityKey }) {
        const subscribersArray = subscriptionHelpers.getSubscribersArray({ entityId, entityKey });
        if (subscribersArray.length !== 0) return;

        delete subscription[entityKey].entityList[entityId];
    },
    
    updateEntity({ entityId, newValues, entityKey }) {
        const prevState = subscription[entityKey].entityList[entityId].info;
        subscription[entityKey].entityList[entityId].info = Object.assign(prevState, newValues);

        return Object.assign({ id: prevState.id }, newValues);
    },
};