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

export const channelsSubscriptionModel: ISubscriptionModel<IChannel> = {
    entityList: {},
    
    async subscribe({ entityId, userId }) {
        console.log(userId, 'subscribed on', entityId);
        try {
            const isExist = isEntityExist({ entityId, entityKey: 'channels' });
            if (!isExist) {
                const channel = await ChannelService.getOne({ channelId: entityId, userId });
                addChannelEntity({ channel });
            } 

            subscribeOn({ entityId, entityKey: 'channels', userId });
            sendChannelEntity({ entityId, to: userId });
        } catch (error) {
            console.log('error during subscribe:', error);
        }
    },

    unsubscribe({ entityId, userId }) {
        console.log(userId, 'unsubscribed from', entityId);
        const isExist = isEntityExist({ entityId, entityKey: 'channels' });
        if (!isExist) return;

        unsubscribeFrom({ entityId, entityKey: 'channels', userId });
        deleteEntity({ entityId, entityKey: 'channels' });
    },

    update({ entity, userId }) {
        console.log(userId + ' make an update');
        const isExist = isEntityExist({ entityId: entity.id, entityKey: 'channels' });
        if (!isExist) return;

        
        updateEntity({ entityId: entity.id, entityKey: 'channels', newValues: { ...entity } });

        const subscribers = getSubscribersArray({ entityId: entity.id, entityKey: 'channels' });
        sendChannelEntity({ entityId: entity.id, to: subscribers });
    },
};

const addChannelEntity = ({ channel }: {channel: IChannel}) => {
    channelsSubscriptionModel.entityList[channel.id] = {
        info: {
            ...channel,
        },
        subscribers: {},
    };
};

const sendChannelEntity = ({ entityId, to }: {entityId: string, to: string | string[]}) => {
    socket.events.sendChannelSubscription({
        to,
        channel: channelsSubscriptionModel.entityList[entityId].info,
    });
};