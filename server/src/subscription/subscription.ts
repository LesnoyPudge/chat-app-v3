import { channelsSubscriptionModel, messagesSubscriptionModel, privateChannelsSubscriptionModel, textRoomsSubscriptionModel, usersSubscriptionModel } from './subscriptionModels';



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
    update: ({ entity }: {entity: Partial<T>}) => void;
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