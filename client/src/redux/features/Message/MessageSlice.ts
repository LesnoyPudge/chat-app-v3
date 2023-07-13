import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { MessageApi } from '@redux/features';



const adapter = createEntityAdapter<Entities.Message.Default>();

const initialState = adapter.getInitialState();

export const MessageSlice = createSlice({
    name: ENTITY_NAMES.MESSAGE,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
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

export const MessageSelectors = adapter.getSelectors((state: RootState) => state.message);