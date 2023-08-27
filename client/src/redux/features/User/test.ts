import { usePromise } from '@hooks';
import { useMemoSelector } from '@redux/hooks';
import { EntityId, nanoid } from '@reduxjs/toolkit';
import { socketIO } from '@root/features';
import { useRef, useEffect } from 'react';
import { ValueOf } from 'ts-essentials';
import { WithId } from '../../../../../shared/types';
import { toSocketEventName } from '../../../../../shared/utils';
import { SUBSCRIBABLE_ENTITIES, SOCKET_CLIENT_EVENT_NAMES } from '../../../../../shared/vars';
import { ChannelSelectors } from '../Channel';
import { ChatSelectors } from '../Chat';
import { MessageSelectors } from '../Message';
import { PrivateChannelSelectors } from '../PrivateChannel';
import { RoleSelectors } from '../Role';
import { RoomSelectors } from '../Room';
import { UserSelectors } from './UserSlice';



type SE = typeof SUBSCRIBABLE_ENTITIES;

type EntitySubscriptionStore = Record<
    ValueOf<SE>,
    Map<EntityId, Set<string>>
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

const useEntitySubscription = <Entity extends WithId>(entityName: ValueOf<SE>, entityId: string) => {
    const hookIdRef = useRef(nanoid());

    const {
        promise,
        data,
        resolve,
    } = usePromise<Entity>();

    const entity = useMemoSelector(
        (state) => selectors[entityName].selectById(entityId)(state) as Entity | undefined,
        [entityName, entityId],
    );

    if (entity) resolve(entity);

    useEffect(() => {
        const entities = entitySubscriptionStore[entityName];
        if (!entities.has(entityId)) entities.set(entityId, new Set());

        const entity = entities.get(entityId);
        if (!entity) return;

        if (entity.has(hookIdRef.current)) return;

        entity.add(hookIdRef.current);

        if (entity.size > 1) return;

        const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
        socketIO.emit(event, entityId);
    }, [entityId, entityName]);

    useEffect(() => {
        const hookId = hookIdRef.current;

        return () => {
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(entityId)) return;

            const entity = entities.get(entityId);
            if (!entity) return;

            if (!entity.has(hookId)) return;

            entity.delete(hookId);

            if (entity.size > 0) return;

            const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE);
            socketIO.emit(event, entityId);
        };
    }, [entityId, entityName]);

    return {
        data,
        promise,
    };
};

const createEntitySubscriptionFunctions = (entityName: ValueOf<SE>) => {
    const id = nanoid();

    return {
        subscribe: (entityId: string) => {
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(entityId)) entities.set(entityId, new Set());

            const entity = entities.get(entityId);
            if (!entity) return;

            if (entity.has(id)) return;

            entity.add(id);

            const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
            socketIO.emit(event, id);
        },

        unsubscribe: (entityId: string) => {
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(entityId)) return;

            const entity = entities.get(entityId);
            if (!entity) return;

            if (!entity.has(id)) return;

            entity.delete(id);

            const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE);
            socketIO.emit(event, id);
        },
    };
};