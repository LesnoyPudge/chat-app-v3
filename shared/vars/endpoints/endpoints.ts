


type WithCategory = <
    CATEGORY extends string, 
    VALUE extends string, 
    ITEMS extends Record<string, VALUE>
>(category: CATEGORY, items: ITEMS) => {[K in keyof ITEMS]: `${CATEGORY}${ITEMS[K]}`};

const withCategory: WithCategory = (category, items) => {
    const entries = (Object.entries(items)).map(([key, value]) => {
        return [key, category + value];
    });

    return Object.fromEntries(entries);
};

const v1 = <T extends string>(path: T): `/api/v1/${T}` => `/api/v1/${path}`;

const users = [
    'auth/registration',
    'auth/login',
    'auth/logout',
    'auth/refresh',
    ':targetId',
    'profile/update',
    'credentials/update',
    'delete',
    'blocked/:targetId/add',
    'blocked/:targetId/remove',
    'emails/access-code',
    'friends/:targetId/send',
    'friends/:targetId/accept',
    'friends/:targetId/decline',
    'friends/:targetId/remove',
    'activate/:activationCode',
    'emails/activation-code',
];

const channels = [
    'create',
    ':channelId',
    ':channelId/update',
    ':channelId/delete',
    ':channelId/members/leave',
    ':channelId/members/:targetId/kick',
    ':channelId/banned/:targetId/ban',
    ':channelId/banned/:targetId/unban',
    ':channelId/invitations/create',
    ':channelId/invitations/:invitationCode/accept',
    ':channelId/invitations/:invitationId/delete',
];

const files = [
    'avatar/:avatarId/read',
    'attachment/:attachmentId/read',
    'avatar/:avatarId/get',
    'role-image/:imageId/read',
];

const messages = [
    'chat/:chatId/messages/create',
    'chat/:chatId/messages/:messageId',
    'chat/:chatId/messages/:messageId/update',
    'chat/:chatId/messages/:messageId/delete',
    'chat/:chatId/messages/:messageId/restore',
    'chat/:chatId/messages/:messageId/attachment/:attachmentId/delete',
];

const privateChannels = [
    '/users/private-channel/create',
    '/users/private-channel/:privateChannelId',
    '/users/private-channel/:privateChannelId/leave',
];

const role = [
    '/channels/:channelId/roles/create',
    '/channels/:channelId/roles/:roleId',
    '/channels/:channelId/roles/:roleId/update',
    '/channels/:channelId/roles/:roleId/delete',
    '/channels/:channelId/roles/:roleId/add-user/:targetId',
    '/channels/:channelId/roles/:roleId/remove-user/:targetId',
];

const room = [
    '/channels/:channelId/rooms/create',
    '/channels/:channelId/rooms/:roomId',
    '/channels/:channelId/rooms/:roomId/update',
    '/channels/:channelId/rooms/:roomId/delete',
];

export const ENDPOINTS = {
    V1: {
        USERS: withCategory(v1('users'), {
            REGISTRATION: '/auth/registration',
        }),
    },
} as const;