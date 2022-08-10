import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { socket } from '@utils';
import { IMessage } from '@backendTypes';
import { MessageApi } from './MessageApi';



const messageAdapter = createEntityAdapter<IMessage>();

const initialState = messageAdapter.getInitialState();

export const MessageSlice = createSlice({
    name: 'message',
    initialState,           
    reducers: {
        addMessage(state, { payload }: PayloadAction<IMessage>) {
            messageAdapter.upsertOne(state, payload);
        },
        removeMessage(state, { payload }: PayloadAction<string>) {
            messageAdapter.removeOne(state, payload);
        },
        subscribeOnMessage(state, { payload }: PayloadAction<string>) {
            socket.events.message.subscribe(payload);
        },
        unsubscribeFromMessage(state, { payload }: PayloadAction<string>) {
            messageAdapter.removeOne(state, payload);
            socket.events.message.unsubscribe(payload);  
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            MessageApi.endpoints.createMessage.matchFulfilled,
            (state, { payload }) => {
                addMessage(payload);
            },
        );
        builder.addMatcher(
            MessageApi.endpoints.deleteMessage.matchFulfilled,
            (state, { payload }) => {
                removeMessage(payload.id);
            },
        );
    },
});

export const {
    addMessage,
    removeMessage,
    subscribeOnMessage,
    unsubscribeFromMessage,

} = MessageSlice.actions;

export const {
    selectById: selectMessageById,
    selectIds: selectMessagesIds,
    selectEntities: selectMessagesEntities,
    selectAll: selectAllMessages,
    selectTotal: selectTotalMessages,
} = messageAdapter.getSelectors((state: RootState) => state.message);