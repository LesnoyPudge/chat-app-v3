import { ChannelService } from '@services';
import { IChannel } from '@types';
import { socket } from '@socket';



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
    update: (channel: IChannel) => void;
}

export const ChannelSubscription: IChannelSubscription = {
    channels: {},

    async subscribe({ userId, channelId }) {
        console.log(userId + ' subscribed on channel: ' + channelId);
        try {
            const isExist = isChannelEntityExist(channelId);
            if (!isExist) {
                const target = await fetchChannel(channelId);
                createChannelEntity(target);
            } 

            subscribeOn({ channelId, userId });
            sendUpdatedChannelEntity({ channelId, to: userId });
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

    update(channel) {
        console.log('channel updated: ' + channel.id);
        const isExist = isChannelEntityExist(channel.id);
        if (!isExist) return createChannelEntity(channel);

        updateChannelEntity(channel);
        const subscribers = getSubscribersArray(channel.id);
        sendUpdatedChannelEntity({ channelId: channel.id, to: subscribers });
    },
};

const isChannelEntityExist = (channelId: string) => {
    return !!ChannelSubscription.channels[channelId];
};

const fetchChannel = async(channelId: string) => {
    const target = await ChannelService.getOne({ channelId });
    return target;
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
};

const unsubscribeFrom = ({ channelId, userId }: {channelId: string, userId: string}) => {
    if (!isChannelEntityExist(channelId)) return;

    ChannelSubscription.channels[channelId].subscribers.delete(userId);
};

const deleteUserChannel = (channelId: string) => {
    if (!isChannelEntityExist(channelId)) return;

    const target = ChannelSubscription.channels[channelId];
    const isZeroSubscribers = target.subscribers.size === 0;
    
    if (isZeroSubscribers) delete ChannelSubscription.channels[channelId];
};

const sendUpdatedChannelEntity = ({ channelId, to }: {channelId: string, to: string | string[]}) => {
    // socket.events.getSubscription({ 
    //     to: userId,
    //     user: UserDto.defaultPreset(subscription.users[targetId]),
    // });
};

const updateChannelEntity = (channel: IChannel) => {
    ChannelSubscription.channels[channel.id] = Object.assign(ChannelSubscription.channels[channel.id], channel);
};

const getSubscribersArray = (channelId: string) => {
    return Array.from(ChannelSubscription.channels[channelId].subscribers);
};