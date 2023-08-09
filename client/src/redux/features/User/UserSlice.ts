import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { UserApi } from '@redux/features';



type UserState = Entities.User.WithoutCredentials | (Entities.User.Preview & Entities.User.WithStatus);

const adapter = createEntityAdapter<UserState>();

const initialState = adapter.getInitialState();

export const UserSlice = createSlice({
    name: ENTITY_NAMES.USER,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,
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

export const UserSelectors = {
    ...adapter.getSelectors(selectUserState),
    selectUserState,
};