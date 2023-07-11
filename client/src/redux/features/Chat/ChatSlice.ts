import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.Chat.Default>();

const initialState = adapter.getInitialState();

export const ChatSlice = createSlice({
    name: ENTITY_NAMES.CHAT,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.Chat.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const ChatSelectors = adapter.getSelectors((state: RootState) => state.chat);