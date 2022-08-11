import { IChannel, IMessage, ITextRoom, IUser, IUserWithStatus } from '@types';



type EntityKeyType = 'users' | 'channels' | 'textRooms' | 'messages';

type EntityType<T> = T & {
    subscribers: Set<string>;
}

interface IEntityList<T> {
    [entityId: string]: EntityType<T>;
}

interface ISubscribeArgs {
    entityKey: EntityKeyType;
    entityId: string;
    userId: string;
}

interface IUnsubscribeArgs {
    entityKey: EntityKeyType;
    entityId: string;
    userId: string;
}

interface IUpdateArgs {
    entityKey: EntityKeyType;
    entity: IUser | IChannel | ITextRoom | IMessage;
    userId: string;
}

interface ISubscription {
    entities: {
        users: IEntityList<IUserWithStatus>;
        channels: IEntityList<IChannel>;
        textRooms: IEntityList<ITextRoom>;
        messages: IEntityList<IMessage>;
    };
    subscribe: (args: ISubscribeArgs) => void;
    unsubscribe: (args: IUnsubscribeArgs) => void;
    update: (args: IUpdateArgs) => void;
}

export const subscription: ISubscription = {
    entities: {
        users: {},
        channels: {},
        textRooms: {},
        // voiceRooms: {} 
        messages: {},
    },

    subscribe({ entityId, entityKey, userId }) {

    },

    unsubscribe({ entityId, entityKey, userId }) {

    },

    update({ entity, entityKey, userId }) {
        
    },
};