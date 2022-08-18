import { UserService } from '@services';
import { socket } from '@socket';
import { IUser, IUserWithStatus } from '@types';
import { ISubscriptionModel } from '@subscription';
import { subscriptionHelpers } from '@subscription/helpers';



interface IUserSubscriptionModel extends ISubscriptionModel<IUserWithStatus> {
    wentOnline: ({ entity }: {entity: IUser}) => void;
    wentOffline: ({ entityId }: {entityId: string}) => void;
}

const { 
    isEntityExist, 
    subscribeOn, 
    unsubscribeFrom,
    getSubscribersArray,
    deleteEntity,
    updateEntity,
} = subscriptionHelpers;

const entityKey = 'users';

export const usersSubscriptionModel: IUserSubscriptionModel = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const entity = await UserService.getOne({ userId, targetId: entityId });
                addUserEntity({ entity, status: 'offline' });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendUserEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscribe:', error);
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
        console.log(entity.id, 'updates');
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return;

        updateEntity({ entityId: entity.id, entityKey, newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey });
        sendUserEntity({ entityId: entity.id, to: subscribers });
    },

    wentOnline({ entity }) {
        console.log(entity.id, 'went online');
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return addUserEntity({ entity, status: 'online' });

        usersSubscriptionModel.entityList[entity.id].info.status = 'online';
        const subscribersArray = getSubscribersArray({ entityId: entity.id, entityKey });
        sendUserEntity({ entityId: entity.id, to: subscribersArray });
    },

    wentOffline({ entityId }) {
        console.log(entityId, 'went offline');
        const isExist = isEntityExist({ entityId, entityKey });
        if (!isExist) return;

        usersSubscriptionModel.entityList[entityId].info.status = 'offline';
        const subscribers = getSubscribersArray({ entityId, entityKey });
        sendUserEntity({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeUserSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addUserEntity = ({ entity, status }: {entity: IUser, status: 'online' | 'offline'}) => {
    usersSubscriptionModel.entityList[entity.id] = {
        info: {
            ...entity,
            status,
        },
        subscribers: {},
    };
};

const sendUserEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendUserSubscription({
        to,
        user: usersSubscriptionModel.entityList[entityId].info, // dto that returns partial info
    });
};

const removeUserSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeUserSubscription({
        to,
        userId: entityId,
    });
};