import { sockets } from '@root';
import { Entities, Prettify, StrictOmit } from '@shared';



interface UserDTO {
    withoutCredentials: (
        user: Prettify<StrictOmit<Entities.User.WithoutCredentials, 'status'> & Partial<StrictOmit<
            Entities.User.Default,
            keyof StrictOmit<Entities.User.WithoutCredentials, 'status'>
        >>>
    ) => Entities.User.WithoutCredentials;

    preview: (
        user: Prettify<StrictOmit<Entities.User.Preview, 'status'> & Partial<StrictOmit<
            Entities.User.Default,
            keyof StrictOmit<Entities.User.Preview, 'status'>
        >>>
    ) => Entities.User.Preview;

    token: (
        user: Prettify<Entities.User.Token & Partial<StrictOmit<
            Entities.User.Default,
            keyof Entities.User.Token
        >>>
    ) => Entities.User.Token;
}

const getStatus = (id: string): Entities.User.Status => {
    return sockets.users.has(id) ? 'online' : 'offline';
};

export const UserDTO: UserDTO = {
    withoutCredentials: (user) => ({
        id: user.id,
        avatarId: user.avatarId,
        blocked: user.blocked,
        channels: user.channels,
        createdAt: user.createdAt,
        email: user.email,
        extraStatus: user.extraStatus,
        friendRequests: user.friendRequests,
        isActivated: user.isActivated,
        isDeleted: user.isDeleted,
        login: user.login,
        friends: user.friends,
        privateChannels: user.privateChannels,
        settings: user.settings,
        username: user.username,
        status: getStatus(user.id),
    }),

    preview: (user) => ({
        id: user.id,
        avatarId: user.avatarId,
        isDeleted: user.isDeleted,
        login: user.login,
        username: user.username,
        blocked: user.blocked,
        extraStatus: user.extraStatus,
        status: getStatus(user.id),
    }),

    token: (user) => ({
        id: user.id,
        email: user.email,
        password: user.password,
    }),
};