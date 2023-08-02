import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { PrivateChannelApi } from '@redux/features';



const adapter = createEntityAdapter<Entities.PrivateChannel.Default>();

const initialState = adapter.getInitialState();

export const PrivateChannelSlice = createSlice({
    name: ENTITY_NAMES.PRIVATE_CHANNEL,
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
            PrivateChannelApi.endpoints[Endpoints.V1.PrivateChannel.Create.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            PrivateChannelApi.endpoints[Endpoints.V1.PrivateChannel.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

export const PrivatePrivateChannelSelectors = adapter.getSelectors((state: RootState) => state.privateChannel);