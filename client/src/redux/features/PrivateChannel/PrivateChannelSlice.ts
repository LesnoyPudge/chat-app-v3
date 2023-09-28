import { resetApiStateAction } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, ENTITY_NAMES } from '@shared';
import { AppSelectors, PrivateChannelApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { SliceEntityState } from '@types';



const adapter = createCustomizedEntityAdapter<SliceEntityState.PrivateChannel>();

const initialState = adapter.getInitialState();

export const PrivateChannelSlice = createSlice({
    name: ENTITY_NAMES.PRIVATE_CHANNEL,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,
    },
    extraReducers(builder) {
        builder.addCase(resetApiStateAction, () => {
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

    selectSecondMemberId: (privateChannelId?: string) => {
        return (state: RootState): string | undefined => {
            if (!privateChannelId) return undefined;

            const { myId } = AppSelectors.selectAppState(state);
            if (!myId) return undefined;

            const privateChannel = PrivateChannelSelectors.selectById(privateChannelId)(state);
            if (!privateChannel) return;

            return privateChannel.members.filter((id) => id !== myId).at(0);
        };
    },
};