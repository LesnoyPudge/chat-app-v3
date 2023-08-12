import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { MessageApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';



const adapter = createCustomizedEntityAdapter<Entities.Message.Default>();

const initialState = adapter.getInitialState();

export const MessageSlice = createSlice({
    name: ENTITY_NAMES.MESSAGE,
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
            MessageApi.endpoints[Endpoints.V1.Message.Create.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            MessageApi.endpoints[Endpoints.V1.Message.Delete.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            MessageApi.endpoints[Endpoints.V1.Message.DeleteAttachment.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            MessageApi.endpoints[Endpoints.V1.Message.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            MessageApi.endpoints[Endpoints.V1.Message.Restore.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            MessageApi.endpoints[Endpoints.V1.Message.Update.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

const selectMessageState = (state: RootState) => state.message;

const adapterSelectors = adapter.customGetSelectors(selectMessageState);

export const MessageSelectors = {
    ...adapterSelectors,
    selectMessageState,
};