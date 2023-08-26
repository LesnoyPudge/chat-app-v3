import { globalReset } from '@redux/globalReset';
import { RootState, store } from '@redux/store';
import { createAction, createAsyncThunk, createListenerMiddleware, createSlice, EntityState, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES, EntityId, SOCKET_CLIENT_EVENT_NAMES, SOCKET_SERVER_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, toSocketEventName, ValueOf } from '@shared';
import { UserApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { socketIO } from '@root/features';
import { useAppDispatch, useMemoSelector } from '@redux/hooks';
import { useEffect, useRef } from 'react';
import { noop } from '@utils';



type UserState = Entities.User.WithoutCredentials | Entities.User.Preview;

const adapter = createCustomizedEntityAdapter<UserState>();

const initialState = adapter.getInitialState();

const updateMe = <T>(fn: (me: Entities.User.WithoutCredentials, value: T) => void) => {
    return (state: EntityState<UserState>, { payload }: PayloadAction<T>) => {
        // import('@redux/store').then(({ store }) => {
        //     // const id = store.getState().app.myId;
        //     const id = undefined;
        //     if (!id) return;

        //     const me = state.entities[id];
        //     if (!me) return;
        //     if (!('email' in me)) return;

        //     fn(me, payload);
        // });
    };
};

const thunkTest = createAsyncThunk(ENTITY_NAMES.USER + '/thunktest', async(_, thunkApi) => {
    console.log('thunk test');

});

// const a1 = createAction<number>('qwe')
// a1(1)

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

};
const event = toSocketEventName('User', SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
socketIO.on('User_error', (id) => {
    console.log('error with', id);
});
socketIO.emit(event, '123');
const useEntitySubscription = (entityName: ValueOf<SE>, entityId: string) => {
    const hookIdRef = useRef(nanoid());
    // const entity = useMemoSelector()

    useEffect(() => {
        const entities = entitySubscriptionStore[entityName];
        if (!entities.has(entityId)) entities.set(entityId, new Set());

        const entity = entities.get(entityId);
        if (!entity) return;

        if (entity.has(hookIdRef.current)) return;

        entity.add(hookIdRef.current);

        const event = toSocketEventName(entityName, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE);
        socketIO.emit(event, entityId);
    }, []);

    // const { dispatch } = useAppDispatch();

    // const controlledPromiseRef = useRef((() => {
    //     const controls = {
    //         resolve: noop,
    //         reject: noop,
    //     };
    //     const promise = new Promise((resolve, reject) => {
    //         controls.resolve = resolve;
    //         controls.reject = reject;
    //     });
    //     return {
    //         promise,
    //         controls,
    //     };
    // })());

    // const selectors = {
    //     User: UserSelectors,
    // };

    // const entity = useMemoSelector(selectors[qwe].selectById(id));
    // if (!entity) {

    // }

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




// const listenerMiddleware = createListenerMiddleware();



// const {
//     subscribe,
//     unsubscribe,
// } = createEntitySubscriptionFunctions(SUBSCRIBABLE_ENTITIES.USER);

// subscribe('qwe');

export const UserSlice = createSlice({
    name: ENTITY_NAMES.USER,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,

        anyAction: (state, { payload }: PayloadAction<string>) => {
            console.log('any action dispatched', payload);
        },

        // subscribe: (state, { payload }: PayloadAction<string>) => {
        //     socketIO.emit(toSocketEventName(SUBSCRIBABLE_ENTITIES.USER, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE), payload);
        // },

        // addChannel: updateMe<Entities.Channel.Default>((me, channel) => {
        //     me.channels.push(channel.id);
        // }),
    },
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.AcceptFriendRequest.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Block.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.CredentialsUpdate.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.DeclineFriendRequest.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.DeleteFriend.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.HidePrivateChannel.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Login.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.ProfileUpdate.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Refresh.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Registration.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.RevokeFriendRequest.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.SendFriendRequest.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Unblock.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

const selectUserState = (state: RootState) => state.user;

const adapterSelectors = adapter.customGetSelectors(selectUserState);

export const UserSelectors = {
    ...adapterSelectors,
    selectUserState,
};