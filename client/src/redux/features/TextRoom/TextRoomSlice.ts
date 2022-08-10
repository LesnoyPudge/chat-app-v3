import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { socket } from '@utils';
import { ITextRoom } from '@backendTypes';
import { TextRoomApi } from './TextRoomApi';



const textRoomAdapter = createEntityAdapter<ITextRoom>();

const initialState = textRoomAdapter.getInitialState();

export const TextRoomSlice = createSlice({
    name: 'textRoom',
    initialState,           
    reducers: {
        addTextRoom(state, { payload }: PayloadAction<ITextRoom>) {
            textRoomAdapter.upsertOne(state, payload);
        },
        removeTextRoom(state, { payload }: PayloadAction<string>) {
            textRoomAdapter.removeOne(state, payload);
        },
        subscribeOnTextRoom(state, { payload }: PayloadAction<string>) {
            socket.events.textRoom.subscribe(payload);
        },
        unsubscribeFromTextRoom(state, { payload }: PayloadAction<string>) {
            textRoomAdapter.removeOne(state, payload);
            socket.events.textRoom.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            TextRoomApi.endpoints.createTextRoom.matchFulfilled,
            (state, { payload }) => {
                addTextRoom(payload);
            },
        );
        builder.addMatcher(
            TextRoomApi.endpoints.deleteTextRoom.matchFulfilled,
            (state, { payload }) => {
                removeTextRoom(payload.id);
            },
        );
    },
});

export const {
    addTextRoom,
    removeTextRoom,
    subscribeOnTextRoom,
    unsubscribeFromTextRoom,

} = TextRoomSlice.actions;

export const {
    selectById: selectTextRoomById,
    selectIds: selectTextRoomsIds,
    selectEntities: selectTextRoomsEntities,
    selectAll: selectAllTextRooms,
    selectTotal: selectTotalTextRooms,
} = textRoomAdapter.getSelectors((state: RootState) => state.textRoom);