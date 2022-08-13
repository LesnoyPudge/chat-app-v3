import { channelsSubscriptionModel, messagesSubscriptionModel, textRoomsSubscriptionModel, usersSubscriptionModel } from './subscriptionModels';



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
    update: ({ userId, entity }: {userId: string, entity: Partial<T>}) => void;
}

export const subscription = {
    users: usersSubscriptionModel,
    channels: channelsSubscriptionModel,
    textRooms: textRoomsSubscriptionModel,
    // voiceRooms: {} 
    messages: messagesSubscriptionModel,
};