import { useAnimationFrame } from '@hooks';
import { ChannelSelectors, ChatSelectors, MessageSelectors, PrivateChannelSelectors, RoleSelectors, RoomSelectors, UserSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { nanoid } from '@reduxjs/toolkit';
import { socketIO } from '@root/features';
import { EntityId, Id, SOCKET_CLIENT_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, ValueOf, WithId, toSocketEventName } from '@shared';
import { useRef, useEffect } from 'react';



type EntitySubscriptionStore = Record<
    ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    Map<EntityId, Set<Id>>
>;

const entitySubscriptionStore = Object.keys(SUBSCRIBABLE_ENTITIES).reduce((acc, cur) => {
    acc[SUBSCRIBABLE_ENTITIES[cur]] = new Map();
    return acc;
}, {} as EntitySubscriptionStore);

const selectors = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: ChannelSelectors,
    [SUBSCRIBABLE_ENTITIES.CHAT]: ChatSelectors,
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: MessageSelectors,
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: PrivateChannelSelectors,
    [SUBSCRIBABLE_ENTITIES.ROLE]: RoleSelectors,
    [SUBSCRIBABLE_ENTITIES.ROOM]: RoomSelectors,
    [SUBSCRIBABLE_ENTITIES.USER]: UserSelectors,
};

export const useEntitySubscription = <Entity extends WithId>(
    entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    ids?: EntityId[],
) => {
    const componentIdRef = useRef(nanoid());
    const entities = useMemoSelector((state) => {
        if (!ids) return [];
        return selectors[entityName].selectByIds(ids)(state);
    }, [ids]) as unknown as Entity[];

    useEffect(() => {
        if (!ids) return;

        const componentId = componentIdRef.current;
        const entitiesMap = entitySubscriptionStore[entityName];

        ids.forEach((id) => {
            if (!entitiesMap.has(id)) entitiesMap.set(id, new Set());

            const entity = entitiesMap.get(id);
            if (!entity) return;

            if (entity.has(componentId)) return;

            entity.add(componentId);

            if (entity.size > 1) return;

            const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
            socketIO.emit(event, id);
        });
    }, [entityName, ids]);

    useEffect(() => {
        const componentId = componentIdRef.current;

        return () => {
            if (!ids) return;

            const entitiesMap = entitySubscriptionStore[entityName];

            ids.forEach((id) => {
                if (!entitiesMap.has(id)) return;

                const entity = entitiesMap.get(id);
                if (!entity) return;

                if (!entity.has(componentId)) return;

                entity.delete(componentId);

                if (entity.size > 0) return;

                const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE);
                socketIO.emit(event, id);
            });
        };
    }, [entityName, ids]);

    return entities;
};