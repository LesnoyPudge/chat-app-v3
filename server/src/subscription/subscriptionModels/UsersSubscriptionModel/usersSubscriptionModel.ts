import { UserService } from '@services';
import { socket } from '@socket';
import { IUser, IUserPreview } from '@types';
import { ISubscriptionModel } from '@subscription';
import { subscriptionHelpers } from '@subscription/helpers';
import { UserDto } from '@dtos';



const { 
    isEntityExist, 
    subscribeOn, 
    unsubscribeFrom,
    getSubscribersArray,
    deleteEntity,
    updateEntity,
} = subscriptionHelpers;

const entityKey = 'users';

export const usersSubscriptionModel: ISubscriptionModel<IUserPreview> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isSameId = userId === entityId;
            const status = isSameId ? 'online' : 'offline';
            const isSameStatus = usersSubscriptionModel.entityList[entityId].info.status === status;
            
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const entity = await UserService.getOne({ userId, targetId: entityId });
                addUserEntity({ entity, status });
            } 

            if (isSameId && !isSameStatus) {
                updateEntity({ entityId, entityKey, newValues: { status } });
                const subscribers = getSubscribersArray({ entityId, entityKey });
                sendUserEntity({ entityId, to: subscribers, type: 'public' });
            }

            subscribeOn({ entityId, entityKey, userId });
            if (!isSameId) sendUserEntity({ entityId, to: userId, type: 'private' });
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

    update({ entity, type = 'public' }) {
        console.log(entity.id, 'updates');
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return;

        updateEntity({ entityId: entity.id, entityKey, newValues: entity });

        if (type === 'public') {
            const subscribers = getSubscribersArray({ entityId: entity.id, entityKey });
            sendUserEntity({ entityId: entity.id, to: subscribers, type });
        }

        if (type === 'private') {
            sendUserEntity({ entityId: entity.id, to: entity.id, type });
        }
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
        subscribers: new Map(),
    };
};

const sendUserEntity = ({ entityId, to, type }: {entityId: string, to: string | string[], type: 'private' | 'public'}) => {
    const userEntity = usersSubscriptionModel.entityList[entityId].info;
    const user = type === 'private' ? userEntity : UserDto.preview(userEntity);

    socket.events.sendUserSubscription({
        to,
        user: userEntity.isDeleted ? UserDto.deleted(user) : user, 
    });
};

const removeUserSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeUserSubscription({
        to,
        userId: entityId,
    });
};