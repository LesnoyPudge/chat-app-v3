import { resetApiStateAction } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, ENTITY_NAMES } from '@shared';
import { RoomApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { SliceEntityState } from '@types';



const adapter = createCustomizedEntityAdapter<SliceEntityState.Room>();

const initialState = adapter.getInitialState();

export const RoomSlice = createSlice({
    name: ENTITY_NAMES.ROOM,
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

const selectRoomState = (state: RootState) => state.room;

const adapterSelectors = adapter.customGetSelectors(selectRoomState);

export const RoomSelectors = {
    ...adapterSelectors,
    selectRoomState,
};