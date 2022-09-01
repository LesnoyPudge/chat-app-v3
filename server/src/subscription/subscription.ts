import { channelsSubscriptionModel, messagesSubscriptionModel, privateChannelsSubscriptionModel, roomsSubscriptionModel, usersSubscriptionModel, rolesSubscriptionModel } from './subscriptionModels';



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
    rooms: roomsSubscriptionModel,
    messages: messagesSubscriptionModel,
    privateChannels: privateChannelsSubscriptionModel,
    roles: rolesSubscriptionModel,
};