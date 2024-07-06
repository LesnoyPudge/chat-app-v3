import { combineReducers } from '@reduxjs/toolkit';
import { rootApi } from '@redux/rootApi';
import { AppSlice, ChannelSlice, UserSlice, RoomSlice, MessageSlice, PrivateChannelSlice, RoleSlice, ChatSlice, ConversationSlice } from '@redux/features';



export const combinedReducer = combineReducers({
    [rootApi.reducerPath]: rootApi.reducer,
    app: AppSlice.reducer,
    user: UserSlice.reducer,
    channel: ChannelSlice.reducer,
    room: RoomSlice.reducer,
    message: MessageSlice.reducer,
    privateChannel: PrivateChannelSlice.reducer,
    role: RoleSlice.reducer,
    chat: ChatSlice.reducer, 
    conversation: ConversationSlice.reducer,
});