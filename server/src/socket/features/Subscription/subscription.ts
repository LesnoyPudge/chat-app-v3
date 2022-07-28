import { UserDto } from '../../../dtos';
import { UserService } from '../../../services';
import { IUser } from '../../../types';
import { socket } from '../../socket';



interface IUserChannel extends IUser {
    status: 'online' | 'offline';
    subscribers: Set<string>;
}

interface IUserChannelEntities {
    [id: string]: IUserChannel;
}

interface ISubscription {
    users: IUserChannelEntities,
    subscribe: (userId: string, targetId: string) => void;
    unsubscribe: (userId: string, targetId: string) => void;
    update: (user: IUser) => void;
    wentOnline: (user: IUser) => void;
    wentOffline: (userId: string) => void;
}

export const subscription: ISubscription = {
    users: {},

    async subscribe(userId, targetId) {
        console.log(userId + ' subscribed on ' + targetId);
        try {
            const isExist = isUserChannelExist(targetId);
            if (!isExist) {
                const target = await fetchTarget(targetId);
                createUserChannel(target, 'offline');
            } 

            subscribeOn(targetId, userId);
            getUserChannelThroughSocket(userId, targetId);
        } catch (error) {
            console.log('error during subscribe: ', error);
        }
    },

    unsubscribe(userId, targetId) {
        console.log(userId + ' unsubscribed from ' + targetId);
        const isExist = isUserChannelExist(targetId);
        if (!isExist) return;

        unsubscribeFrom(userId, targetId);
        deleteUserChannel(targetId);
    },

    update(user) {
        console.log(user.id + ' make an update');
        const isExist = isUserChannelExist(user.id);
        if (!isExist) return createUserChannel(user, 'online');

        updateUserChannel(user);
        sendUpdateThroughSocket(user.id);
    },

    wentOnline(user) {
        console.log(user.id + ' went online');
        const isExist = isUserChannelExist(user.id);
        if (!isExist) return createUserChannel(user, 'online');

        changeStatus(user.id, 'online');
        sendUpdateThroughSocket(user.id);
    },

    wentOffline(userId) {
        console.log(userId + ' went offline');
        const isExist = isUserChannelExist(userId);
        if (!isExist) return;

        changeStatus(userId, 'offline');
        sendUpdateThroughSocket(userId);
        deleteUserChannel(userId);
    },
}; 

const isUserChannelExist = (targetId: string) => {
    return !!subscription.users[targetId];
};

const createUserChannel = (user: IUser, status: 'online' | 'offline') => {
    if (isUserChannelExist(user.id)) return;

    subscription.users[user.id] = {
        ...user,
        status,
        subscribers: new Set(),
    };
};

const subscribeOn = (targetId: string, userId: string) => {
    if (!isUserChannelExist(targetId)) return;

    subscription.users[targetId].subscribers.add(userId);
};

const unsubscribeFrom = (userId: string, targetId: string) => {
    if (!isUserChannelExist(targetId)) return;
    subscription.users[targetId].subscribers.delete(userId);
};

const deleteUserChannel = (targetId: string) => {
    if (!isUserChannelExist(targetId)) return;

    const target = subscription.users[targetId];
    const isOffline = target.status === 'offline';
    const isZeroSubscribers = target.subscribers.size === 0;
    const isUseless = isOffline && isZeroSubscribers;
    
    if (isUseless) delete subscription.users[targetId];
};

const getUserChannelThroughSocket = (userId: string, targetId: string) => {
    socket.events.getSubscription({ 
        to: userId,
        user: UserDto.defaultPreset(subscription.users[targetId]),
    });
};

const sendUpdateThroughSocket = (userId: string) => {
    const user = subscription.users[userId];

    if (user.subscribers.size === 0) return;

    socket.events.sendSubscriptionUpdate({
        to: Array.from(user.subscribers), 
        user: UserDto.defaultPreset(user),
    });
};

const fetchTarget = async(targetId: string) => {
    const target = await UserService.get({ targetId });
    return {
        ...target,
    };
};

const updateUserChannel = (user: IUser) => {
    subscription.users[user.id] = Object.assign(subscription.users[user.id], user);
};

const changeStatus = (userId: string, newStatus: 'online' | 'offline') => {
    subscription.users[userId].status = newStatus;
};