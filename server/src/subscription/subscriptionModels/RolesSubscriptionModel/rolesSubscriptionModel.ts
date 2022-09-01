import { RoleService, RoleServiceHelpers } from '@services';
import { socket } from '@socket';
import { IRole } from '@types';
import { ISubscriptionModel } from '@subscription';
import { subscriptionHelpers } from '@subscription/helpers';
import { RoleDto } from '@dtos';



const { 
    isEntityExist, 
    subscribeOn, 
    unsubscribeFrom,
    getSubscribersArray,
    deleteEntity,
    updateEntity,
} = subscriptionHelpers;

const entityKey = 'roles';

export const rolesSubscriptionModel: ISubscriptionModel<IRole> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const role = await RoleServiceHelpers.getOne({ _id: entityId });
                addRoleEntity({ role: RoleDto.objectFromModel(role) });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendRoleEntity({ entityId, to: userId });
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

    update({ entity }) {
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey, newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey });
        sendRoleEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeRoleSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addRoleEntity = ({ role }: {role: IRole}) => {
    rolesSubscriptionModel.entityList[role.id] = {
        info: {
            ...role,
        },
        subscribers: new Map(),
    };
};

const sendRoleEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendRoleSubscription({
        to,
        role: rolesSubscriptionModel.entityList[entityId].info,
    });
};

const removeRoleSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeRoleSubscription({
        to,
        roleId: entityId,
    });
};