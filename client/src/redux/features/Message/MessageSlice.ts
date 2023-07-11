import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.Message.Default>();

const initialState = adapter.getInitialState();

export const MessageSlice = createSlice({
    name: ENTITY_NAMES.MESSAGE,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.Message.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const MessageSelectors = adapter.getSelectors((state: RootState) => state.message);