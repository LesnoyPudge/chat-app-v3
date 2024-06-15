import { 
    ChannelSelectors, ChatSelectors, MessageSelectors, 
    PrivateChannelSelectors, RoleSelectors, RoomSelectors, 
    UserSelectors 
} from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { nanoid } from '@reduxjs/toolkit';
import { socketIO } from '@root/features';
import { 
    EntityId, Id, SOCKET_CLIENT_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, 
    ValueOf, WithId, toSocketEventName 
} from '@shared';
import { SliceEntityState } from '@types';
import { useRef, useEffect } from 'react';
import { defaultSelector, useConst } from "@lesnoypudge/utils-react";


type EntitySubscriptionStore = Record<
    ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    Map<EntityId, Set<Id>>
>;

type MapEntityNameToValue = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: SliceEntityState.Channel[],
    [SUBSCRIBABLE_ENTITIES.CHAT]: SliceEntityState.Chat[],
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: SliceEntityState.Message[],
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: SliceEntityState.PrivateChannel[],
    [SUBSCRIBABLE_ENTITIES.ROLE]: SliceEntityState.Role[],
    [SUBSCRIBABLE_ENTITIES.ROOM]: SliceEntityState.Room[],
    [SUBSCRIBABLE_ENTITIES.USER]: SliceEntityState.User[],
}

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

export const useEntitySubscriptionV2 = <
    _EntityName extends ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    _Value,
    _SelectedValue = _Value,
>(
    entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    ids: EntityId[] | undefined,
    selector: (
        v: MapEntityNameToValue[_EntityName]
    ) => _SelectedValue = defaultSelector
) => {
    const componentId = useConst(() => nanoid());
    const entities = useMemoSelector((state) => {
        if (!ids) return [];
        return selector(selectors[entityName].selectByIds(ids)(state));
    }, [ids]);

    useEffect(() => {
        if (!ids) return;
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
    }, [componentId, entityName, ids]);

    useEffect(() => {
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
    }, [componentId, entityName, ids]);

    return entities;
};