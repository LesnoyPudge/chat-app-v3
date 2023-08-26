import { UserSlice, ChannelSlice, ChatSlice, MessageSlice, PrivateChannelSlice, RoleSlice, RoomSlice } from '@redux/features';
import { useAppDispatch } from '@redux/hooks';
import { socketIO } from '@root/features';
import { useEffect } from 'react';
import { SUBSCRIBABLE_ENTITIES, SOCKET_SERVER_EVENT_NAMES, toSocketEventName, AnyFunction } from '@shared';



export const useSocketListeners = () => {
    const { dispatch } = useAppDispatch();

    // const listeners = Object.keys(SUBSCRIBABLE_ENTITIES).reduce((acc, cur) => {
    //     return acc;
    // }, {} as Record<keyof typeof SUBSCRIBABLE_ENTITIES, AnyFunction>);

    // Object.keys(SUBSCRIBABLE_ENTITIES).forEach((key) => {
    //     socketIO.on(
    //         toSocketEventName(SUBSCRIBABLE_ENTITIES[key], SOCKET_SERVER_EVENT_NAMES.DATA),
    //         (_, data) => dispatch(UserSlice.actions.upsertOne(data)),
    //     );
    // })

    useEffect(() => {
        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.USER, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(UserSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.CHANNEL, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(ChannelSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.CHAT, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(ChatSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.MESSAGE, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(MessageSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(PrivateChannelSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.ROLE, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(RoleSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.ROOM, SOCKET_SERVER_EVENT_NAMES.DATA),
            (_, data) => dispatch(RoomSlice.actions.upsertOne(data)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.USER, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(UserSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.CHANNEL, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(ChannelSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.CHAT, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(ChatSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.MESSAGE, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(MessageSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(PrivateChannelSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.ROLE, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(RoleSlice.actions.removeOne(id)),
        );

        socketIO.on(
            toSocketEventName(SUBSCRIBABLE_ENTITIES.ROOM, SOCKET_SERVER_EVENT_NAMES.DELETE),
            (id) => dispatch(RoomSlice.actions.removeOne(id)),
        );
    }, [dispatch]);
};