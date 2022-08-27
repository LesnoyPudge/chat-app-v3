import { channelsSubscriptionModel, messagesSubscriptionModel, privateChannelsSubscriptionModel, textRoomsSubscriptionModel, usersSubscriptionModel } from './subscriptionModels';



type EntityType<T> = {
    info: T;
    subscribers: Map<string, number>
}

interface IEntityList<T> {
    [entityId: string]: EntityType<T>;
}

export interface ISubscriptionModel<T> {
    entityList: IEntityList<T>;
    subscribe: ({ userId, entityId }: {userId: string, entityId: string}) => void;
    unsubscribe: ({ userId, entityId }: {userId: string, entityId: string}) => void;
    update: ({ entity, type }: {entity: Partial<T>, type?: 'private' | 'public'}) => void;
    delete: ({ entityId }: {entityId: string}) => void;
}

export const subscription = {
    users: usersSubscriptionModel,
    channels: channelsSubscriptionModel,
    textRooms: textRoomsSubscriptionModel,
    // voiceRooms: {} 
    messages: messagesSubscriptionModel,
    privateChannels: privateChannelsSubscriptionModel,
};