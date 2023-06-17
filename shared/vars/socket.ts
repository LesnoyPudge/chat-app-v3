


export const SOCKET_CLIENT_EVENT_NAMES = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
} as const;

export const SOCKET_SERVER_EVENT_NAMES = {
    DATA: 'data',
    ERROR: 'error',
    DELETE: 'delete',
} as const;