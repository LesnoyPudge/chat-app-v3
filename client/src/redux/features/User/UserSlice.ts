import { resetApiStateAction } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { AppSelectors, UserApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { SliceEntityState } from '@types';
import { localStorageApi } from '@utils';



const adapter = createCustomizedEntityAdapter<SliceEntityState.User>();

const initialState = adapter.getInitialState();

export const UserSlice = createSlice({
    name: ENTITY_NAMES.USER,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,
        updateOne: adapter.updateOne,

        // updateMe: (state, { payload }: PayloadAction<Partial<Entities.User.WithoutCredentials>>) => {
        //     const myId = localStorageApi.get('myId');
        //     if (!myId) return;

        //     adapter.updateOne(state, { id: myId, changes: payload });
        // },
    },
    extraReducers(builder) {
        builder.addCase(resetApiStateAction, () => {
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

    selectAmIBlocked: (userId?: string) => {
        return (state: RootState): boolean => {
            if (!userId) return false;

            const { myId } = AppSelectors.selectAppState(state);
            if (!myId) return false;

            const user = UserSelectors.selectById(userId)(state);
            if (!user) return false;

            return user.blocked.includes(myId);
        };
    },

    selectIsBlockedByMe: (userId?: string) => {
        return (state: RootState): boolean => {
            if (!userId) return false;

            const me = AppSelectors.selectMe(state);
            if (!me) return false;

            return me.blocked.includes(userId);
        };
    },
};