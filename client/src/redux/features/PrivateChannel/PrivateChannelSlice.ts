import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { PrivateChannelApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';



const adapter = createCustomizedEntityAdapter<Entities.PrivateChannel.Default>();

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

const selectPrivateChannelState = (state: RootState) => state.privateChannel;

const adapterSelectors = adapter.customGetSelectors(selectPrivateChannelState);

export const PrivateChannelSelectors = {
    ...adapterSelectors,
    selectPrivateChannelState,
};