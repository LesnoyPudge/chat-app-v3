import { Context, FC, createContext, useContext, useMemo } from 'react';
import { Id, SUBSCRIBABLE_ENTITIES, ValueOf, WithId } from '@shared';
import { PropsWithChildrenAsNodeOrFunction, SliceEntityState } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { useEntitySubscription } from '@hooks';



type ContextArgs<Entity extends WithId> = [Entity | undefined, Id | undefined];

type LoadedContextArgs<Entity extends WithId> = [Entity, Id];

export const EntityContext = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createContext<ContextArgs<SliceEntityState.Channel>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createContext<ContextArgs<SliceEntityState.Chat>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createContext<ContextArgs<SliceEntityState.Message>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createContext<ContextArgs<SliceEntityState.PrivateChannel>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createContext<ContextArgs<SliceEntityState.Role>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createContext<ContextArgs<SliceEntityState.Room>>(undefined as any),
    [SUBSCRIBABLE_ENTITIES.USER]: createContext<ContextArgs<SliceEntityState.User>>(undefined as any),
};

type ProviderProps<Entity extends WithId> = (
    Partial<WithId> &
    PropsWithChildrenAsNodeOrFunction<ContextArgs<Entity>> &
    {
        fakeEntity?: Entity;
    }
)

export const createEntityContextProvider = <Entity extends WithId>(
    entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
) => {
    const Provider: FC<ProviderProps<Entity>> = ({
        id,
        fakeEntity,
        children,
    }) => {
        const ids = useMemo(() => id === undefined ? [] : [id], [id]);
        const [entity] = useEntitySubscription(entityName, ids) as (Entity | undefined)[];

        const SelectedContext = EntityContext[entityName];

        const contextArgs: ContextArgs<Entity> = [
            fakeEntity ?? entity,
            id,
        ];

        return (
            <SelectedContext.Provider value={contextArgs as any}>
                <ChildrenAsNodeOrFunction args={contextArgs}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </SelectedContext.Provider>
        );
    };

    Provider.displayName = `${entityName}ContextProvider`;

    return Provider;
};

export const EntityContextProvider = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createEntityContextProvider<SliceEntityState.Channel>(
        SUBSCRIBABLE_ENTITIES.CHANNEL,
    ),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createEntityContextProvider<SliceEntityState.Chat>(
        SUBSCRIBABLE_ENTITIES.CHAT,
    ),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createEntityContextProvider<SliceEntityState.Message>(
        SUBSCRIBABLE_ENTITIES.MESSAGE,
    ),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createEntityContextProvider<SliceEntityState.PrivateChannel>(
        SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL,
    ),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createEntityContextProvider<SliceEntityState.Role>(
        SUBSCRIBABLE_ENTITIES.ROLE,
    ),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createEntityContextProvider<SliceEntityState.Room>(
        SUBSCRIBABLE_ENTITIES.ROOM,
    ),
    [SUBSCRIBABLE_ENTITIES.USER]: createEntityContextProvider<SliceEntityState.User>(
        SUBSCRIBABLE_ENTITIES.USER,
    ),
};

const createHelpers = <Entity extends WithId>(
    entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
) => {
    const Loading: FC<PropsWithChildrenAsNodeOrFunction<ContextArgs<Entity>>> = ({
        children,
    }) => {
        const args = useContext(EntityContext[entityName] as any) as ContextArgs<Entity>;
        if (!args) throw new Error(`EntityContext${entityName} is undefined`);

        return (
            <>
                <If condition={!args[0]}>
                    <ChildrenAsNodeOrFunction args={args}>
                        {children}
                    </ChildrenAsNodeOrFunction>
                </If>
            </>
        );
    };

    const Loaded: FC<PropsWithChildrenAsNodeOrFunction<LoadedContextArgs<Entity>>> = ({
        children,
    }) => {
        const args = useContext(EntityContext[entityName] as any) as ContextArgs<Entity>;
        if (!args) throw new Error(`EntityContext${entityName} is undefined`);

        return (
            <>
                <If condition={!!args[0]}>
                    <ChildrenAsNodeOrFunction args={args as LoadedContextArgs<Entity>}>
                        {children}
                    </ChildrenAsNodeOrFunction>
                </If>
            </>
        );
    };

    return {
        Loading,
        Loaded,
    };
};

export const EntityContextHelpers = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: createHelpers<SliceEntityState.Channel>(
        SUBSCRIBABLE_ENTITIES.CHANNEL,
    ),
    [SUBSCRIBABLE_ENTITIES.CHAT]: createHelpers<SliceEntityState.Chat>(
        SUBSCRIBABLE_ENTITIES.CHAT,
    ),
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: createHelpers<SliceEntityState.Message>(
        SUBSCRIBABLE_ENTITIES.MESSAGE,
    ),
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: createHelpers<SliceEntityState.PrivateChannel>(
        SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL,
    ),
    [SUBSCRIBABLE_ENTITIES.ROLE]: createHelpers<SliceEntityState.Role>(
        SUBSCRIBABLE_ENTITIES.ROLE,
    ),
    [SUBSCRIBABLE_ENTITIES.ROOM]: createHelpers<SliceEntityState.Room>(
        SUBSCRIBABLE_ENTITIES.ROOM,
    ),
    [SUBSCRIBABLE_ENTITIES.USER]: createHelpers<SliceEntityState.User>(
        SUBSCRIBABLE_ENTITIES.USER,
    ),
};

export const LoadedEntityContext = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.CHANNEL] as Context<LoadedContextArgs<
            SliceEntityState.Channel
        >>
    ),
    [SUBSCRIBABLE_ENTITIES.CHAT]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.CHAT] as Context<LoadedContextArgs<
            SliceEntityState.Chat
        >>
    ),[SUBSCRIBABLE_ENTITIES.MESSAGE]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.MESSAGE] as Context<LoadedContextArgs<
            SliceEntityState.Message
        >>
    ),[SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL] as Context<LoadedContextArgs<
            SliceEntityState.PrivateChannel
        >>
    ),[SUBSCRIBABLE_ENTITIES.ROLE]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.ROLE] as Context<LoadedContextArgs<
            SliceEntityState.Role
        >>
    ),[SUBSCRIBABLE_ENTITIES.ROOM]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.ROOM] as Context<LoadedContextArgs<
            SliceEntityState.Room
        >>
    ),[SUBSCRIBABLE_ENTITIES.USER]: (
        EntityContext[SUBSCRIBABLE_ENTITIES.USER] as Context<LoadedContextArgs<
            SliceEntityState.User
        >>
    ),
};