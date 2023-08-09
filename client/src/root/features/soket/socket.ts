import { ChannelSlice, ChatSlice, MessageSlice, PrivateChannelSlice, RoleSlice, RoomSlice, UserSlice } from '@redux/features';
import { store } from '@redux/store';
import { SOCKET_SERVER_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, SocketClientEvents, SocketServerEvents, toSocketEventName } from '@shared';
import { getEnv } from '@utils';
import { Socket, io } from 'socket.io-client';



export const socketIO = io(
    getEnv().CUSTOM_SERVER_URL,
    { autoConnect: false },
) as Socket<
    SocketServerEvents,
    SocketClientEvents
>;

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.USER, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(UserSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.CHANNEL, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(ChannelSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.CHAT, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(ChatSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.MESSAGE, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(MessageSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(PrivateChannelSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.ROLE, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(RoleSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.ROOM, SOCKET_SERVER_EVENT_NAMES.DATA),
    (_, data) => {
        store.dispatch(RoomSlice.actions.upsertOne(data));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.USER, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(UserSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.CHANNEL, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(ChannelSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.CHAT, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(ChatSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.MESSAGE, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(MessageSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(PrivateChannelSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.ROLE, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(RoleSlice.actions.removeOne(id));
    },
);

socketIO.on(
    toSocketEventName(SUBSCRIBABLE_ENTITIES.ROOM, SOCKET_SERVER_EVENT_NAMES.DELETE),
    (id) => {
        store.dispatch(RoomSlice.actions.removeOne(id));
    },
);