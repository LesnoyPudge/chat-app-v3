import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



const adapter = createEntityAdapter<Entities.PrivateChannel.Default>();

const initialState = adapter.getInitialState();

export const PrivateChannelSlice = createSlice({
    name: ENTITY_NAMES.PRIVATE_CHANNEL,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<Entities.PrivateChannel.Default>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

export const PrivatePrivateChannelSelectors = adapter.getSelectors((state: RootState) => state.privateChannel);