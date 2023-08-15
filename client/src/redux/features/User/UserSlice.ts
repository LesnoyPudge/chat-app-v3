import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice, EntityState, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES, EntityId, SOCKET_CLIENT_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, toSocketEventName, ValueOf } from '@shared';
import { UserApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { socketIO } from '@root/features';



type UserState = Entities.User.WithoutCredentials | Entities.User.Preview;

const adapter = createCustomizedEntityAdapter<UserState>();

const initialState = adapter.getInitialState();

const updateMe = <T>(fn: (me: Entities.User.WithoutCredentials, value: T) => void) => {
    return (state: EntityState<UserState>, { payload }: PayloadAction<T>) => {
        import('@redux/store').then(({ store }) => {
            const id = store.getState().app.myId;
            if (!id) return;

            const me = state.entities[id];
            if (!me) return;
            if (!('email' in me)) return;

            fn(me, payload);
        });
    };
};

type EntitySubscriptionStore = Record<
    ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    Map<EntityId, Set<string>>
>;

const entitySubscriptionStore = Object.keys(SUBSCRIBABLE_ENTITIES).reduce((acc, cur) => {
    acc[SUBSCRIBABLE_ENTITIES[cur]] = new Map();
    return acc;
}, {} as EntitySubscriptionStore);

const createEntitySubscribtionFunctions = (entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>) => {
    const id = nanoid();

    return {
        subscribe: (entityId: string) => {
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(entityId)) entities.set(entityId, new Set());

            const entity = entities.get(entityId);
            if (!entity) return;

            entity.add(id);
        },

        unsubscribe: (entityId: string) => {
            const entities = entitySubscriptionStore[entityName];
            if (!entities.has(entityId)) return;

            const entity = entities.get(entityId);
            if (!entity) return;

            entity.delete(id);
        },
    };
};

const {
    subscribe,
    unsubscribe,
} = createEntitySubscribtionFunctions(SUBSCRIBABLE_ENTITIES.USER);

subscribe('qwe');

export const UserSlice = createSlice({
    name: ENTITY_NAMES.USER,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,

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