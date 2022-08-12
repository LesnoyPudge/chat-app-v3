import { usersSubscriptionModel } from './subscriptionModels/UsersSubscriptionModel';



type EntityKeyType = 'users' /*| 'channels' | 'textRooms' | 'messages'*/;

type EntityType<T> = {
    info: T;
    subscribers: {
        [subscriberId: string]: {
            counter: number;
        }
    };
}

interface IEntityList<T> {
    [entityId: string]: EntityType<T>;
}

export interface ISubscriptionModel<T> {
    entityList: IEntityList<T>;
    subscribe: ({ userId, entityId }: {userId: string, entityId: string}) => void;
    unsubscribe: ({ userId, entityId }: {userId: string, entityId: string}) => void;
    update: ({ userId, entity }: {userId: string, entity: T}) => void;
}

export const subscription = {
    users: usersSubscriptionModel,
    // channels: {},
    // textRooms: {},
    // // voiceRooms: {} 
    // messages: {},
};

interface ISubscriptionHelpers {
    isEntityExist: (args: {entityId: string, entityKey: EntityKeyType}) => boolean;
    subscribeOn: (args: {entityId: string, userId: string, entityKey: EntityKeyType}) => void;
    unsubscribeFrom: (args: {entityId: string, userId: string, entityKey: EntityKeyType}) => void;
    getSubscribersArray: (args: {entityId: string, entityKey: EntityKeyType}) => string[];
    deleteEntity: (args: {entityId: string, entityKey: EntityKeyType}) => void;
    updateEntity: (args: {entityId: string, newValues: Record<string, unknown>, entityKey: EntityKeyType}) => void;
}

export const subscriptionHelpers: ISubscriptionHelpers = {
    isEntityExist({ entityId, entityKey }) {
        return !!subscription[entityKey].entityList[entityId];
    },

    subscribeOn({ entityId, userId, entityKey }) {
        subscription[entityKey].entityList[entityId].subscribers[userId].counter++;
    },

    unsubscribeFrom({ entityId, userId, entityKey }) {
        const counter = subscription[entityKey].entityList[entityId].subscribers[userId].counter;

        if (counter > 1) {
            subscription[entityKey].entityList[entityId].subscribers[userId].counter--;
            return;
        }

        delete subscription[entityKey].entityList[entityId].subscribers[userId];
    },

    getSubscribersArray({ entityId, entityKey }) {
        return Object.keys(subscription[entityKey].entityList[entityId].subscribers);
    },

    deleteEntity({ entityId, entityKey }) {
        const subscribersArray = subscriptionHelpers.getSubscribersArray({ entityId, entityKey });
        if (subscribersArray.length !== 0) return;

        delete subscription[entityKey].entityList[entityId];
    },
    
    updateEntity({ entityId, newValues, entityKey }) {
        const prevState = subscription[entityKey].entityList[entityId].info;
        subscription[entityKey].entityList[entityId].info = Object.assign(prevState, newValues);
    },
};