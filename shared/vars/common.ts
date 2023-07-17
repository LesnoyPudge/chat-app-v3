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

export const SUBSCRIBABLE_ENTITIES: StrictOmit<typeof MODEL_NAMES, 'FILE'> = {
    CHANNEL: ENTITY_NAMES.CHANNEL,
    CHAT: ENTITY_NAMES.CHAT,
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

export const HTTP_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;