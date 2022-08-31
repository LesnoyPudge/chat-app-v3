import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { socket } from '@utils';
import { IRoom } from '@backendTypes';
import { RoomApi } from './RoomApi';



const roomAdapter = createEntityAdapter<IRoom>();

const initialState = roomAdapter.getInitialState();

export const RoomSlice = createSlice({
    name: 'room',
    initialState,           
    reducers: {
        addRoom(state, { payload }: PayloadAction<IRoom>) {
            roomAdapter.upsertOne(state, payload);
        },
        removeRoom(state, { payload }: PayloadAction<string>) {
            roomAdapter.removeOne(state, payload);
        },
        subscribeOnRoom(state, { payload }: PayloadAction<string>) {
            socket.events.room.subscribe(payload);
        },
        unsubscribeFromRoom(state, { payload }: PayloadAction<string>) {
            roomAdapter.removeOne(state, payload);
            socket.events.room.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            RoomApi.endpoints.createRoom.matchFulfilled,
            (state, { payload }) => {
                addRoom(payload);
            },
        );
        builder.addMatcher(
            RoomApi.endpoints.deleteRoom.matchFulfilled,
            (state, { payload }) => {
                removeRoom(payload.id);
            },
        );
    },
});

export const {
    addRoom,
    removeRoom,
    subscribeOnRoom,
    unsubscribeFromRoom,

} = RoomSlice.actions;

export const {
    selectById: selectRoomById,
    selectIds: selectRoomsIds,
    selectEntities: selectRoomsEntities,
    selectAll: selectAllRooms,
    selectTotal: selectTotalRooms,
} = roomAdapter.getSelectors((state: RootState) => state.room);