import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { RoomApi } from '@redux/features';



const adapter = createEntityAdapter<Entities.Room.Default>();

const initialState = adapter.getInitialState();

export const RoomSlice = createSlice({
    name: ENTITY_NAMES.ROOM,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
    },
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });

        builder.addMatcher(
            RoomApi.endpoints[Endpoints.V1.Room.Create.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoomApi.endpoints[Endpoints.V1.Room.Delete.ActionNameWithEntity].matchFulfilled,
            (state, { meta }) => {
                adapter.removeOne(state, meta.arg.originalArgs.roomId);
            },
        );

        builder.addMatcher(
            RoomApi.endpoints[Endpoints.V1.Room.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoomApi.endpoints[Endpoints.V1.Room.Update.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

export const RoomSelectors = adapter.getSelectors((state: RootState) => state.room);