import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { ChatApi } from '@redux/features';



const adapter = createEntityAdapter<Entities.Chat.Default>();

const initialState = adapter.getInitialState();

export const ChatSlice = createSlice({
    name: ENTITY_NAMES.CHAT,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
    },
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });

        builder.addMatcher(
            ChatApi.endpoints[Endpoints.V1.Chat.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

export const ChatSelectors = adapter.getSelectors((state: RootState) => state.chat);