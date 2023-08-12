import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { ChatApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';



const adapter = createCustomizedEntityAdapter<Entities.Chat.Default>();

const initialState = adapter.getInitialState();

export const ChatSlice = createSlice({
    name: ENTITY_NAMES.CHAT,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,
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

const selectChatState = (state: RootState) => state.chat;

const adapterSelectors = adapter.customGetSelectors(selectChatState);

export const ChatSelectors = {
    ...adapterSelectors,
    selectChatState,
};