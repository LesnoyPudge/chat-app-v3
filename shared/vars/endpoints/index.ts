


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





// const channels = [
//     'create',
//     ':channelId',
//     ':channelId/update',
//     ':channelId/delete',
//     ':channelId/members/leave',
//     ':channelId/members/:targetId/kick',
//     ':channelId/banned/:targetId/ban',
//     ':channelId/banned/:targetId/unban',
//     ':channelId/invitations/create',
//     ':channelId/invitations/:invitationCode/accept',
//     ':channelId/invitations/:invitationId/delete',
// ];

// const messages = [
//     'chat/:chatId/messages/create',
//     'chat/:chatId/messages/:messageId',
//     'chat/:chatId/messages/:messageId/update',
//     'chat/:chatId/messages/:messageId/delete',
//     'chat/:chatId/messages/:messageId/restore',
//     'chat/:chatId/messages/:messageId/attachment/:attachmentId/delete',
// ];
// const room = [
//     '/channels/:channelId/rooms/create',
//     '/channels/:channelId/rooms/:roomId',
//     '/channels/:channelId/rooms/:roomId/update',
//     '/channels/:channelId/rooms/:roomId/delete',
// ];
// const role = [
//     '/channels/:channelId/roles/create',
//     '/channels/:channelId/roles/:roleId',
//     '/channels/:channelId/roles/:roleId/update',
//     '/channels/:channelId/roles/:roleId/delete',
//     '/channels/:channelId/roles/:roleId/add-user/:targetId',
//     '/channels/:channelId/roles/:roleId/remove-user/:targetId',
// ];
// const privateChannels = [
//     '/users/private-channel/create',
//     '/users/private-channel/:privateChannelId',
//     '/users/private-channel/:privateChannelId/leave',
// ];

// const files = [
//     'avatar/:avatarId/read',
//     'attachment/:attachmentId/read',
//     'avatar/:avatarId/get',
//     'role-image/:imageId/read',
// ];

export const ENDPOINTS = {
    V1: {
        USER: withCategory(v1('user'), {
            REGISTRATION: '/registration',
            LOGIN: '/login',
            LOGOUT: '/logout',
            REFRESH: '/refresh',
            GET_ONE: '',
            PROFILE_UPDATE: '/profile/update',
            CREDENTIAL_UPDATE: '/credentials/update',
            DELETE: '/delete',
            BLOCK: '/block/add',
            UNBLOCK: '/block/remove',
            REQUEST_ACCESS_CODE: '/email/access-code',
            SEND_FRIEND_REQUEST: '/friend-request/send',
            ACCEPT_FRIEND_REQUEST: '/friend-request/accept',
            DECLINE_FRIEND_REQUEST: '/friend-request/decline',
            REMOVE_FRIEND_REQUEST: '/friend-request/remove',
        }),

        CHANNEL: withCategory(v1('channel'), {
            CREATE: '/create',
            GET_ONE: '',
            UPDATE: '/update',
            DELETE: '/delete',
            MEMBER_LEAVE: '/member/leave',
            MEMBER_KICK: '/member/kick',
            BAN: '/ban/add',
            UNBAN: '/ban/remove',
            CREATE_INVITATION: '/invitation/create',
            ACCEPT_INVITATION: '/invitation/accept',
            DELETE_INVITATION: '/invitation/delete',
        }),

        MESSAGE: withCategory(v1('message'), {
            CREATE: '/create',
            GET_ONE: '',
            UPDATE: '/update',
            DELETE: '/delete',
            RESTORE: '/restore',
            DELETE_ATTACHMENT: '/attachment/delete',
        }),

        ROOM: withCategory(v1('room'), {
            CREATE: '/create',
            GET_ONE: '',
            UPDATE: '/update',
            DELETE: '/delete',
        }),

        ROLE: withCategory(v1('role'), {
            CREATE: '/create',
            GET_ONE: '',
            UPDATE: '/update',
            DELETE: '/delete',
            ADD_MEMBER: '/member/add',
            REMOVE_MEMBER: '/member/remove',
        }),

        PRIVATE_CHANNEL: withCategory(v1('private-channel'), {
            CREATE: '/create',
            GET_ONE: '',
            LEAVE: '/leave',
        }),

        FILE: withCategory('file', {
            READ_AVATAR: '/read/avatar',
            READ_ATTACHMENT: '/read/attachment',
            READ_IMAGE: '/read/image',
            GET_AVATAR: '/get/avatar',
        }),
    },
} as const;