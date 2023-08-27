import { Context, FC, createContext, useEffect, useRef } from 'react';
import { Entities, EntityId, Id, SOCKET_CLIENT_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, ValueOf, WithId, toSocketEventName } from '@shared';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { useAppSelector, useMemoSelector } from '@redux/hooks';
import { ChannelSelectors, ChatSelectors, MessageSelectors, PrivateChannelSelectors, RoleSelectors, RoomSelectors, UserSelectors } from '@redux/features';
import { ControlledPromise, useLatest, usePromise } from '@hooks';
import { nanoid } from '@reduxjs/toolkit';
import { socketIO } from '@root/features';










// const UserContextProvider: FC<WithId & PropsWithChildrenAsNodeOrFunction<ChildrenArgs>> = ({
//     id,
//     children,
// }) => {
//     const user = useMemoSelector(UserSelectors.selectById(id));
//     const contextArgs: ChildrenArgs = {

//     };
//     usePromise();

//     return (
//         <UserContext.Provider value={contextArgs}>
//             <ChildrenAsNodeOrFunction args={contextArgs}>
//                 {children}
//             </ChildrenAsNodeOrFunction>
//         </UserContext.Provider>
//     );
// };

type EntitySubscriptionStore = Record<
    ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    Map<EntityId, Set<Id>>
>;

const entitySubscriptionStore = Object.keys(SUBSCRIBABLE_ENTITIES).reduce((acc, cur) => {
    acc[SUBSCRIBABLE_ENTITIES[cur]] = new Map();
    return acc;
}, {} as EntitySubscriptionStore);

export const EntityContext = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createContext(
        undefined as unknown as ControlledPromise<Entities.Channel.Default>,
    ),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createContext(
        undefined as unknown as ControlledPromise<Entities.Chat.Default>,
    ),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createContext(
        undefined as unknown as ControlledPromise<Entities.Message.Default>,
    ),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createContext(
        undefined as unknown as ControlledPromise<Entities.PrivateChannel.Default>,
    ),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createContext(
        undefined as unknown as ControlledPromise<Entities.Role.Default>),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createContext(
        undefined as unknown as ControlledPromise<Entities.Room.Default>,
    ),
    [SUBSCRIBABLE_ENTITIES.USER]: createContext(
        undefined as unknown as Entities.User.Preview | undefined,
    ),
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
// ValueOf<typeof SUBSCRIBABLE_ENTITIES>
const createEntityContextProvider = <Entity extends WithId>(entityName: 'User') => {
    const Provider: FC<WithId & PropsWithChildrenAsNodeOrFunction<ControlledPromise<Entity>>> = ({
        id,
        children,
    }) => {
        const componentIdRef = useRef(nanoid());
        const contextArgs = usePromise<Entity>();
        // console.log('id', id);
        // const entity = useMemoSelector(
        //     (state) => selectors[entityName].selectById(id)(state) as Entity | undefined,
        //     [id],
        // );

        const entity = useAppSelector((state) => selectors[entityName].selectById(id)(state)) as Entity | undefined;
        // const entity = undefined;
        // console.log('entity', entity?.id);
        if (entity) contextArgs.resolve(entity);

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
                console.log('123');
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

        const SelectedContext = EntityContext[entityName] as unknown as Context<ControlledPromise<Entity>>;

        return (
            <SelectedContext.Provider value={contextArgs}>
                <ChildrenAsNodeOrFunction args={contextArgs}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </SelectedContext.Provider>
        );
    };

    Provider.displayName = `${entityName}ContextProvider`;

    return Provider;
};

const Provider: FC<WithId & PropsWithChildrenAsNodeOrFunction<Entities.User.Preview | undefined>> = ({
    id,
    children,
}) => {
    const entityName = 'User';
    const componentIdRef = useRef(nanoid());
    // const contextArgs = usePromise<Entities.User.Preview>();
    // const { resolve, reset, data, isRejected, isResolved } = contextArgs;
    const entity = useMemoSelector(
        (state) => selectors[entityName].selectById(id)(state),
        [id],
    );
    // const isPendingRef = useLatest(!isRejected && !isResolved);
    // const entity = useAppSelector((state) => selectors[entityName].selectById(id)(state));

    // useEffect(() => {
    //     if (isPendingRef.current) return;
    //     console.log('reset');
    //     reset();
    // }, [id, isPendingRef, reset]);

    // useEffect(() => {
    //     if (!entity) return;
    //     if (data?.id === entity.id) return;

    //     console.log('resolve', data?.id, entity.id);
    //     resolve(entity);
    // }, [entity, resolve, data]);

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
        <SelectedContext.Provider value={entity}>
            <ChildrenAsNodeOrFunction args={entity}>
                {children}
            </ChildrenAsNodeOrFunction>
        </SelectedContext.Provider>
    );
};

export const EntityContextProvider = {
    // [SUBSCRIBABLE_ENTITIES.CHANNEL]: createEntityContextProvider<Entities.Channel.Default>(SUBSCRIBABLE_ENTITIES.CHANNEL),
    // [SUBSCRIBABLE_ENTITIES.CHAT]: createEntityContextProvider<Entities.Chat.Default>(SUBSCRIBABLE_ENTITIES.CHAT),
    // [SUBSCRIBABLE_ENTITIES.MESSAGE]: createEntityContextProvider<Entities.Message.Default>(SUBSCRIBABLE_ENTITIES.MESSAGE),
    // [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createEntityContextProvider<Entities.PrivateChannel.Default>(SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL),
    // [SUBSCRIBABLE_ENTITIES.ROLE]: createEntityContextProvider<Entities.Role.Default>(SUBSCRIBABLE_ENTITIES.ROLE),
    // [SUBSCRIBABLE_ENTITIES.ROOM]: createEntityContextProvider<Entities.Room.Default>(SUBSCRIBABLE_ENTITIES.ROOM),
    // [SUBSCRIBABLE_ENTITIES.USER]: createEntityContextProvider<Entities.User.Preview>(SUBSCRIBABLE_ENTITIES.USER),
    [SUBSCRIBABLE_ENTITIES.USER]: Provider,
};

export const EntityContextHelpers = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: {
        Loaded: <></>,
        Loading: <></>,
        Error: <></>,
        LoadingOrError: <></>,
    },
};