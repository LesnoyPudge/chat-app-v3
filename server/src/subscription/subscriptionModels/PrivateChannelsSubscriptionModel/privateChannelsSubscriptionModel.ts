import { PrivateChannelService } from '@services';
import { socket } from '@socket';
import { IPrivateChannel } from '@types';
import { ISubscriptionModel } from '@subscription';
import { subscriptionHelpers } from '@subscription/helpers';



const { 
    isEntityExist, 
    subscribeOn, 
    unsubscribeFrom,
    getSubscribersArray,
    deleteEntity,
    updateEntity,
} = subscriptionHelpers;

const entityKey = 'privateChannels';

export const privateChannelsSubscriptionModel: ISubscriptionModel<IPrivateChannel> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const privateChannel = await PrivateChannelService.getOne({ userId, privateChannelId: entityId });
                addPrivateChannelsEntity({ privateChannel });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendPrivateChannelsEntity({ entityId, to: userId });
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
        const isExist = isEntityExist({ entityId: entity.id, entityKey });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey, newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey });
        sendPrivateChannelsEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removePrivateChannelSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addPrivateChannelsEntity = ({ privateChannel }: {privateChannel: IPrivateChannel}) => {
    privateChannelsSubscriptionModel.entityList[privateChannel.id] = {
        info: {
            ...privateChannel,
        },
        subscribers: {},
    };
};

const sendPrivateChannelsEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendPrivateChannelSubscription({
        to,
        privateChannel: privateChannelsSubscriptionModel.entityList[entityId].info,
    });
};

const removePrivateChannelSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removePrivateChannelSubscription({
        to,
        privateChannelId: entityId,
    });
};