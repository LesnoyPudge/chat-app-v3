import { UserSlice, ChannelSlice, ChatSlice, MessageSlice, PrivateChannelSlice, RoleSlice, RoomSlice } from '@redux/features';
import { useAppDispatch } from '@redux/hooks';
import { socketIO } from '@root/features';
import { useEffect } from 'react';
import { SUBSCRIBABLE_ENTITIES, SOCKET_SERVER_EVENT_NAMES, toSocketEventName } from '@shared';



const slices = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: ChannelSlice,
    [SUBSCRIBABLE_ENTITIES.CHAT]: ChatSlice,
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: MessageSlice,
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: PrivateChannelSlice,
    [SUBSCRIBABLE_ENTITIES.ROLE]: RoleSlice,
    [SUBSCRIBABLE_ENTITIES.ROOM]: RoomSlice,
    [SUBSCRIBABLE_ENTITIES.USER]: UserSlice,
};

export const useSocketListeners = () => {
    const { dispatch } = useAppDispatch();

    useEffect(() => {
        Object.keys(SUBSCRIBABLE_ENTITIES).forEach((key) => {
            const value = SUBSCRIBABLE_ENTITIES[key];

            socketIO.on(
                toSocketEventName(value, SOCKET_SERVER_EVENT_NAMES.DATA),
                (_: string, entity: any) => {
                    dispatch(slices[value].actions.upsertOne(entity));
                },
            );

            socketIO.on(
                toSocketEventName(value, SOCKET_SERVER_EVENT_NAMES.DELETE),
                (id) => {
                    dispatch(slices[value].actions.removeOne(id));
                },
            );
        });

        return () => {
            Object.keys(SUBSCRIBABLE_ENTITIES).forEach((key) => {
                const value = SUBSCRIBABLE_ENTITIES[key];

                socketIO.off(toSocketEventName(value, SOCKET_SERVER_EVENT_NAMES.DATA));
                socketIO.off(toSocketEventName(value, SOCKET_SERVER_EVENT_NAMES.DELETE));
            });
        };
    }, [dispatch]);
};