import { StrictOmit } from 'ts-essentials';



export const ENTITY_NAMES = {
    USER: 'User',
    CHANNEL: 'Channel',
    ROOM: 'Room',
    PRIVATE_CHANNEL: 'PrivateChannel',
    FILE: 'File',
    MESSAGE: 'Message',
    ROLE: 'Role',
    CHAT: 'Chat',
    VOICE_CHAT: 'VoiceChat',
} as const;

export const MODEL_NAMES: StrictOmit<typeof ENTITY_NAMES, 'VOICE_CHAT'> = {
    CHANNEL: ENTITY_NAMES.CHANNEL,
    CHAT: ENTITY_NAMES.CHAT,
    FILE: ENTITY_NAMES.FILE,
    MESSAGE: ENTITY_NAMES.MESSAGE,
    PRIVATE_CHANNEL: ENTITY_NAMES.PRIVATE_CHANNEL,
    ROLE: ENTITY_NAMES.ROLE,
    ROOM: ENTITY_NAMES.ROOM,
    USER: ENTITY_NAMES.USER,
};

export const SOCKET_CLIENT_EVENT_NAMES = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
} as const;

export const SOCKET_SERVER_EVENT_NAMES = {
    DATA: 'data',
    ERROR: 'error',
    DELETE: 'delete',
} as const;