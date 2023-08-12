import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { ChannelApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';



const adapter = createCustomizedEntityAdapter<Entities.Channel.Default>();

const initialState = adapter.getInitialState();

export const ChannelSlice = createSlice({
    name: ENTITY_NAMES.CHANNEL,
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
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.Ban.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.Create.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.Delete.ActionNameWithEntity].matchFulfilled,
            (state, { meta }) => {
                adapter.removeOne(state, meta.arg.originalArgs.channelId);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            ChannelApi.endpoints[Endpoints.V1.Channel.AcceptInvitation.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});
const selectChannelState = (state: RootState) => state.channel;

const adapterSelectors = adapter.customGetSelectors(selectChannelState);

export const ChannelSelectors = {
    ...adapterSelectors,
    selectChannelState,
};