import { UserService } from '@services';
import { socket } from '@socket';
import { IUser, IUserWithStatus } from '@types';
import { ISubscriptionModel, subscriptionHelpers } from 'src/subscription/subscription';



interface IUserSubscriptionModel extends ISubscriptionModel<IUserWithStatus> {
    wentOnline: ({ user }: {user: IUser}) => void;
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

export const usersSubscriptionModel: IUserSubscriptionModel = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey: 'users' });
            if (!isExist) {
                const user = await UserService.get({ targetId: entityId });
                const isMyId = entityId === userId;
                addUserEntity({ user, status: isMyId ? 'online' : 'offline' });
            } 

            subscribeOn({ entityId, entityKey: 'users', userId });
            sendUserEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscribe:', error);
        }
    },

    unsubscribe({ entityId, userId }) {
        console.log(userId, 'unsubscribed from', entityId);
        const isExist = isEntityExist({ entityId, entityKey: 'users' });
        if (!isExist) return;

        unsubscribeFrom({ entityId, entityKey: 'users', userId });
        deleteEntity({ entityId, entityKey: 'users' });
    },

    update({ entity, userId }) {
        console.log(userId + ' make an update');
        const isExist = isEntityExist({ entityId: entity.id, entityKey: 'users' });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey: 'users', newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey: 'users' });
        sendUserEntity({ entityId: entity.id, to: subscribers });
    },

    wentOnline({ user }) {
        console.log(user.id, 'went online');
        const isExist = isEntityExist({ entityId: user.id, entityKey: 'users' });
        if (!isExist) return addUserEntity({ user, status: 'online' });

        usersSubscriptionModel.entityList[user.id].info.status = 'online';
        const subscribersArray = getSubscribersArray({ entityId: user.id, entityKey: 'users' });
        sendUserEntity({ entityId: user.id, to: subscribersArray });
    },

    wentOffline({ entityId }) {
        console.log(entityId, 'went offline');
        const isExist = isEntityExist({ entityId, entityKey: 'users' });
        if (!isExist) return;

        usersSubscriptionModel.entityList[entityId].info.status = 'offline';
        const subscribers = getSubscribersArray({ entityId, entityKey: 'users' });
        sendUserEntity({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey: 'users' });
    },
};

const addUserEntity = ({ user, status }: {user: IUser, status: 'online' | 'offline'}) => {
    usersSubscriptionModel.entityList[user.id] = {
        info: {
            ...user,
            status,
        },
        subscribers: {},
    };
};

const sendUserEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendUserSubscription({
        to,
        user: usersSubscriptionModel.entityList[entityId].info,
    });
};