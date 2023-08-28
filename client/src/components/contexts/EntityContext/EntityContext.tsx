import { FC, createContext, useEffect, useRef } from 'react';
import { EntityId, Id, SOCKET_CLIENT_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, ValueOf, WithId, toSocketEventName } from '@shared';
import { PropsWithChildrenAsNodeOrFunction, SliceEntityState } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { useMemoSelector } from '@redux/hooks';
import { ChannelSelectors, ChatSelectors, MessageSelectors, PrivateChannelSelectors, RoleSelectors, RoomSelectors, UserSelectors } from '@redux/features';
import { nanoid } from '@reduxjs/toolkit';
import { socketIO } from '@root/features';



type EntitySubscriptionStore = Record<
    ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    Map<EntityId, Set<Id>>
>;

const entitySubscriptionStore = Object.keys(SUBSCRIBABLE_ENTITIES).reduce((acc, cur) => {
    acc[SUBSCRIBABLE_ENTITIES[cur]] = new Map();
    return acc;
}, {} as EntitySubscriptionStore);

export const EntityContext = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createContext<SliceEntityState.Channel | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createContext<SliceEntityState.Chat | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createContext<SliceEntityState.Message | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createContext<SliceEntityState.PrivateChannel | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createContext<SliceEntityState.Role | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createContext<SliceEntityState.Room | undefined>(undefined),
    [SUBSCRIBABLE_ENTITIES.USER]: createContext<SliceEntityState.User | undefined>(undefined),
};

const selectors = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: ChannelSelectors,
    [SUBSCRIBABLE_ENTITIES.CHAT]: ChatSelectors,
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: MessageSelectors,
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: PrivateChannelSelectors,
    [SUBSCRIBABLE_ENTITIES.ROLE]: RoleSelectors,
    [SUBSCRIBABLE_ENTITIES.ROOM]: RoomSelectors,
    [SUBSCRIBABLE_ENTITIES.USER]: UserSelectors,
};

export const createEntityContextProvider = <Entity extends WithId>(
    entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
) => {
    const Provider: FC<WithId & PropsWithChildrenAsNodeOrFunction<Entity | undefined>> = ({
        id,
        children,
    }) => {
        const componentIdRef = useRef(nanoid());
        const entity = useMemoSelector(
            (state) => selectors[entityName].selectById(id)(state),
            [id],
        ) as Entity | undefined;

        useEffect(() => {
            const componentId = componentIdRef.current;
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(id)) entities.set(id, new Set());

            const entity = entities.get(id);
            if (!entity) return;

            if (entity.has(componentId)) return;

            entity.add(componentId);

            if (entity.size > 1) return;

            const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
            socketIO.emit(event, id);
        }, [id]);

        useEffect(() => {
            const componentId = componentIdRef.current;

            return () => {
                const entities = entitySubscriptionStore[entityName];
                if (!entities.has(id)) return;

                const entity = entities.get(id);
                if (!entity) return;

                if (!entity.has(componentId)) return;

                entity.delete(componentId);

                if (entity.size > 0) return;

                const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE);
                socketIO.emit(event, id);
            };
        }, [id]);

        const SelectedContext = EntityContext[entityName];

        return (
            <SelectedContext.Provider value={entity as any}>
                <ChildrenAsNodeOrFunction args={entity}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </SelectedContext.Provider>
        );
    };

    Provider.displayName = `${entityName}ContextProvider`;

    return Provider;
};

export const EntityContextProvider = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createEntityContextProvider<SliceEntityState.Channel>(SUBSCRIBABLE_ENTITIES.CHANNEL),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createEntityContextProvider<SliceEntityState.Chat>(SUBSCRIBABLE_ENTITIES.CHAT),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createEntityContextProvider<SliceEntityState.Message>(SUBSCRIBABLE_ENTITIES.MESSAGE),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createEntityContextProvider<SliceEntityState.PrivateChannel>(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createEntityContextProvider<SliceEntityState.Role>(SUBSCRIBABLE_ENTITIES.ROLE),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createEntityContextProvider<SliceEntityState.Room>(SUBSCRIBABLE_ENTITIES.ROOM),
    [SUBSCRIBABLE_ENTITIES.USER]: createEntityContextProvider<SliceEntityState.User>(SUBSCRIBABLE_ENTITIES.USER),
};