import { globalReset } from '@redux/globalReset';
import { RootState, store } from '@redux/store';
import { createAction, createAsyncThunk, createListenerMiddleware, createSlice, EntityState, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES, EntityId, SOCKET_CLIENT_EVENT_NAMES, SOCKET_SERVER_EVENT_NAMES, SUBSCRIBABLE_ENTITIES, toSocketEventName, ValueOf, WithId } from '@shared';
import { ChannelSelectors, ChatSelectors, MessageSelectors, PrivateChannelSelectors, RoleSelectors, RoomSelectors, UserApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { socketIO } from '@root/features';
import { useAppDispatch, useMemoSelector } from '@redux/hooks';
import { useEffect, useRef } from 'react';
import { noop } from '@utils';
import { usePromise } from '@hooks';



type UserState = Entities.User.Preview;

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