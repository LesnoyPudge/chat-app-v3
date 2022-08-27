import { ChannelService } from '@services';
import { socket } from '@socket';
import { IChannel } from '@types';
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

const entityKey = 'channels';

export const channelsSubscriptionModel: ISubscriptionModel<IChannel> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey });
            if (!isExist) {
                const channel = await ChannelService.getOne({ channelId: entityId, userId });
                addChannelEntity({ channel });
            } 

            subscribeOn({ entityId, entityKey, userId });
            sendChannelEntity({ entityId, to: userId });
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
        sendChannelEntity({ entityId: entity.id, to: subscribers });
    },

    delete({ entityId }) {
        const subscribers = getSubscribersArray({ entityId, entityKey });
        removeChannelSubscription({ entityId, to: subscribers });
        deleteEntity({ entityId, entityKey });
    },
};

const addChannelEntity = ({ channel }: {channel: IChannel}) => {
    channelsSubscriptionModel.entityList[channel.id] = {
        info: {
            ...channel,
        },
        subscribers: new Map(),
    };
};

const sendChannelEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendChannelSubscription({
        to,
        channel: channelsSubscriptionModel.entityList[entityId].info,
    });
};

const removeChannelSubscription = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.removeChannelSubscription({
        to,
        channelId: entityId,
    });
};