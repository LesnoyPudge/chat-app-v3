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












// enum Status {
//     ONLINE = 'online',
//     OFFLINE = 'offline',
// }

// interface IUserChannel extends IUser {
//     status: Status;
//     subscribers: string[];
// }

// interface ISubscriptionSubscribe {
//     userId: string;
//     targetId: string;
// }

// interface ISubscriptionUnsubscribe {
//     userId: string;
//     targetId: string;
// }

// interface ISubscription {
//     users: IUserChannel[];
//     subscribe: ({ userId, targetId }: ISubscriptionSubscribe) => void;
//     unsubscribe: ({ userId, targetId }: ISubscriptionUnsubscribe) => void;
//     update: (user: IUser) => void;
//     wentOnline: (user: IUser) => void;
//     wentOffline: (userId: string) => void;
// }

// export const subscription: ISubscription = {
//     users: [],

//     async subscribe({ userId, targetId }) {
//         console.log(`${userId} subscribed to ${targetId}`);
//         const isExist = isUserChannelExist(targetId);

//         if (isExist) {
//             const userChannelIndex = getUserChannelIndexById(targetId);
//             subscribe({ userChannelIndex, userId });
//             const userChannel = getUserChannelByIndex(userChannelIndex);
//             getSubscription({ userId, userChannel });
//             return;
//         } 
//         try {
//             const target = await fetchTarget(targetId);
//             const userChannel = createUserChannel({ user: target, status: Status.OFFLINE });
//             pushUserChannel(userChannel);
//             const userChannelIndex = getUserChannelIndexById(targetId);
//             console.log(userChannel, subscription.users);
//             subscribe({ userChannelIndex, userId });
//             getSubscription({ userId, userChannel });
//         } catch (error) {
//             console.log('error during subscription: ', error);
//             return;
//         }
//     },

//     unsubscribe({ userId, targetId }) {
//         console.log(`${userId} unsubscribed from ${targetId}`);
//         const userChannelIndex = getUserChannelIndexById(targetId);
//         unsubscribe({ userChannelIndex, userId });
//         console.log(`subs after ${userId} unsubscription: [${subscription.users[userChannelIndex].subscribers}]`);
//         remove(userChannelIndex);
//     },

//     update(user) {
//         console.log(`${user.id} updated`);
//         if (isUserChannelExist(user.id)) {
//             const userChannelIndex = getUserChannelIndexById(user.id);
//             const updatedUserChannel = updateUserChannel({ userChannelIndex, user });
//             sendUpdate(updatedUserChannel);
//             console.log(`${user.id} update send to: [${updatedUserChannel.subscribers}]`);
//         } else {
//             const userChannel = createUserChannel({ user, status: Status.ONLINE });
//             pushUserChannel(userChannel);
//             const userChannelIndex = getUserChannelIndexById(user.id);
//             updateUserChannel({ userChannelIndex, user });
//             console.log('users after update: ', subscription.users);
//         }
//     },

//     wentOnline(user) {
//         console.log(`${user.id} went online`);
//         if (isUserChannelExist(user.id)) {
//             const userChannelIndex = getUserChannelIndexById(user.id);
//             wentOnline(userChannelIndex);
//             updateUserChannel({ userChannelIndex, user });
//         } else {
//             const userChannel = createUserChannel({ user, status: Status.ONLINE });
//             pushUserChannel(userChannel);
//         }
//     },

//     wentOffline(userId) {
//         console.log(`${userId} went offline`);
//         if (!isUserChannelExist(userId)) return;

//         const userChannelIndex = getUserChannelIndexById(userId);
//         const userChannel = wentOffline(userChannelIndex);
//         sendUpdate(userChannel);
//         remove(userChannelIndex);
//     },
// };

// const remove = (userChannelIndex: number) => {
//     const target = subscription.users[userChannelIndex];
//     const isOffline = target.status === 'offline';
//     const isNoSubscribers = target.subscribers.length === 0;
//     const isUseless = isOffline && isNoSubscribers;
//     if (!isUseless) return;
//     subscription.users = subscription.users.filter((item) => item.id !== target.id);
//     console.log(`user ${target.id} was removed`);
// };

// interface IGetSubscription {
//     userId: string;
//     userChannel: IUserChannel;
// }
// type GetSubscription = (args: IGetSubscription) => void;

// const getSubscription: GetSubscription = ({ userId, userChannel }) => {
//     console.log(userId);
//     socket.events.getSubscription({ to: userId, user: UserDto.defaultPreset(userChannel) });
// };

// interface ISubscribe {
//     userChannelIndex: number;
//     userId: string;
// }
// type SubscribeType = (args: ISubscribe) => void;

// const subscribe: SubscribeType = ({ userChannelIndex, userId }) => {
//     subscription.users[userChannelIndex].subscribers.push(userId);
// };

// interface IUnsubscribe {
//     userChannelIndex: number;
//     userId: string;
// }
// type UnsubscribeType = (args: IUnsubscribe) => void;

// const unsubscribe: UnsubscribeType = ({ userChannelIndex, userId }) => {
//     subscription.users[userChannelIndex].subscribers = subscription.users[userChannelIndex].subscribers.filter((item) => item !== userId);
// };

// type SendUpdateType = (userChannel: IUserChannel) => void;

// const sendUpdate: SendUpdateType = (userChannel) => {
//     if (!userChannel.subscribers.length) return;

//     socket.events.sendSubscriptionUpdate({
//         to: userChannel.subscribers, 
//         user: UserDto.defaultPreset(userChannel),
//     });
// };

// type GetUserChannelByIndex = (userChannelIndex: number) => IUserChannel;

// const getUserChannelByIndex: GetUserChannelByIndex = (userChannelIndex) => {
//     return subscription.users[userChannelIndex];
// };

// type WentOnlineType = (userChannelIndex: number) => IUserChannel;

// const wentOnline: WentOnlineType = (userChannelIndex) => {
//     subscription.users[userChannelIndex].status = Status.ONLINE;
//     return subscription.users[userChannelIndex];
// };

// type WentOfflineType = (userChannelIndex: number) => IUserChannel;

// const wentOffline: WentOfflineType = (userChannelIndex) => {
//     subscription.users[userChannelIndex].status = Status.OFFLINE;
//     return subscription.users[userChannelIndex];
// };

// interface IUpdateUserChannel {
//     userChannelIndex: number;
//     user: IUser;
// }
// type UpdateUserChannelType = ({ userChannelIndex, user }: IUpdateUserChannel) => IUserChannel;

// const updateUserChannel: UpdateUserChannelType = ({ userChannelIndex, user }) => {
//     const updatedUserChannel = Object.assign(subscription.users[userChannelIndex], user);
//     subscription.users[userChannelIndex] = updatedUserChannel;
//     return updatedUserChannel;
// };

// type GetUserChannelById = (targetId: string) => IUserChannel | undefined;

// const getUserChannelById: GetUserChannelById = (targetId) => {
//     return subscription.users.find((user) => user.id === targetId);
// };

// type GetUserChannelIndexById = (targetId: string) => number;

// const getUserChannelIndexById: GetUserChannelIndexById = (targetId) => {
//     return subscription.users.findIndex((item) => item.id === targetId);
// };

// type FetchTargetType = (targetId: string) => Promise<IUser>;

// const fetchTarget: FetchTargetType = async(targetId) => {
//     const target = await UserService.get({ targetId });
//     return {
//         ...target,
//     };
// };

// type IsUserChannelExistType = (targetId: string) => boolean;

// const isUserChannelExist: IsUserChannelExistType = (targetId) => {
//     return subscription.users.some((item) => item.id === targetId);
// };

// interface ICreateUserChannel {
//     user: IUser;
//     status: Status;
// }
// type CreateUserChannelType = (args: ICreateUserChannel) => IUserChannel;

// const createUserChannel: CreateUserChannelType = ({ user, status }) => {
//     const userChannel: IUserChannel = {
//         ...user,
//         status,
//         subscribers: [],
//     };
//     return userChannel;
// };

// type PushUserChannelType = (userChannel: IUserChannel) => void;

// const pushUserChannel: PushUserChannelType = (userChannel) => {
//     subscription.users.push(userChannel);
// };