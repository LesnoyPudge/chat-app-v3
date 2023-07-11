import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.Channel.Default>();

const initialState = adapter.getInitialState();

export const ChannelSlice = createSlice({
    name: ENTITY_NAMES.CHANNEL,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.Channel.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const ChannelSelectors = adapter.getSelectors((state: RootState) => state.channel);