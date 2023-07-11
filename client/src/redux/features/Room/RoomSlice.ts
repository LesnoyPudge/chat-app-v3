import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.Room.Default>();

const initialState = adapter.getInitialState();

export const RoomSlice = createSlice({
    name: ENTITY_NAMES.ROOM,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.Room.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const RoomSelectors = adapter.getSelectors((state: RootState) => state.room);