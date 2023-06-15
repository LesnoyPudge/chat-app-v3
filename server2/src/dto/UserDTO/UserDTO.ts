import { Entities, Prettify, StrictOmit } from '@shared';



interface UserDTO {
    withoutCredentials: (
        user: Prettify<Entities.User.WithoutCredentials & Partial<StrictOmit<
            Entities.User.Default, 
            keyof Entities.User.WithoutCredentials
        >>>
    ) => Entities.User.WithoutCredentials;
    
    preview: (
        user: Prettify<Entities.User.Preview & Partial<StrictOmit<
            Entities.User.Default,
            keyof Entities.User.Preview
        >>>
    ) => Entities.User.Preview;

    token: (
        user: Prettify<Entities.User.Token & Partial<StrictOmit<
            Entities.User.Default,
            keyof Entities.User.Token
        >>>
    ) => Entities.User.Token;
}

export const UserDTO: UserDTO = {
    withoutCredentials: (user) => ({
        id: user.id,
        avatar: user.avatar,
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
    }),

    preview: (user) => ({
        id: user.id,
        avatar: user.avatar,
        isDeleted: user.isDeleted,
        login: user.login,
        username: user.username,
        blocked: user.blocked,
    }),

    token: (user) => ({
        id: user.id,
        email: user.email,
        password: user.password,
    }),
};