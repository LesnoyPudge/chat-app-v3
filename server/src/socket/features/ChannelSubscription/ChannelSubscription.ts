import { ChannelService } from '@services';
import { socket } from '@socket';
import { IChannel } from '@types';



interface IChannelEntity extends IChannel {
    subscribers: Set<string>;
}

interface IChannelEntities {
    [id: string]: IChannelEntity;
}

interface IChannelSubscription {
    channels: IChannelEntities,
    subscribe: ({ userId, channelId }: {userId: string, channelId: string}) => void;
    unsubscribe: ({ userId, channelId }: {userId: string, channelId: string}) => void;
    update: ({ userId, channel }: {userId: string, channel: IChannel}) => void;
}

export const ChannelSubscription: IChannelSubscription = {
    channels: {},

    async subscribe({ userId, channelId }) {
        console.log(userId + ' subscribed on channel: ' + channelId);
        try {
            const isExist = isChannelEntityExist(channelId);
            if (!isExist) {
                const target = await ChannelService.getOne({ userId, channelId });
                createChannelEntity(target);
            } 

            subscribeOn({ channelId, userId });
            sendChannelEntity({ channelId, to: userId });
        } catch (error) {
            console.log('error during subscribe: ', error);
        }
    },

    unsubscribe({ userId, channelId }) {
        console.log(userId + ' unsubscribed from channel: ' + channelId);
        const isExist = isChannelEntityExist(channelId);
        if (!isExist) return;

        unsubscribeFrom({ userId, channelId });
        deleteUserChannel(channelId);
    },

    update({ userId, channel }) {
        console.log('channel:', channel.id, 'updated by:', userId);
        const isExist = isChannelEntityExist(channel.id);
        if (!isExist) {
            createChannelEntity(channel);
            // subscribeOn({ channelId: channel.id, userId });
            return;
        }

        updateChannelEntity(channel);
        const subscribers = getSubscribersArray(channel.id);
        sendChannelEntity({ channelId: channel.id, to: subscribers });
    },
};

const isChannelEntityExist = (channelId: string) => {
    return !!ChannelSubscription.channels[channelId];
};

const createChannelEntity = (channel: IChannel) => {
    if (isChannelEntityExist(channel.id)) return;

    ChannelSubscription.channels[channel.id] = {
        ...channel,
        subscribers: new Set(),
    };
};

const subscribeOn = ({ channelId, userId }: {channelId: string, userId: string}) => {
    if (!isChannelEntityExist(channelId)) return;
    
    ChannelSubscription.channels[channelId].subscribers.add(userId);
    console.log('subscribers count:', ChannelSubscription.channels[channelId].subscribers.size);
};

const unsubscribeFrom = ({ channelId, userId }: {channelId: string, userId: string}) => {
    if (!isChannelEntityExist(channelId)) return;

    ChannelSubscription.channels[channelId].subscribers.delete(userId);
};

const deleteUserChannel = (channelId: string) => {
    if (!isChannelEntityExist(channelId)) return;

    const target = ChannelSubscription.channels[channelId];
    const isZeroSubscribers = target.subscribers.size === 0;
    console.log('subscribers left:', target.subscribers.size);
    if (isZeroSubscribers) delete ChannelSubscription.channels[channelId];
};

const sendChannelEntity = ({ channelId, to }: {channelId: string, to: string | string[]}) => {
    console.log('channel entity send to:', to);
    
    socket.events.sendChannelSubscription({ 
        to, 
        channel: ChannelSubscription.channels[channelId], 
    });
};

const updateChannelEntity = (channel: IChannel) => {
    if (!isChannelEntityExist(channel.id)) return;
    ChannelSubscription.channels[channel.id] = Object.assign(ChannelSubscription.channels[channel.id], channel);
};

const getSubscribersArray = (channelId: string) => {
    return Array.from(ChannelSubscription.channels[channelId].subscribers);
};