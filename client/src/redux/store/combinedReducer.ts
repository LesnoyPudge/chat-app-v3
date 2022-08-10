import { combineReducers } from '@reduxjs/toolkit';
import { ChannelSlice, TextRoomSlice, UserSlice, UsersSlice, MessageSlice } from '@redux/features';
import { rootApi } from '@redux/rootApi';



export const combinedReducer = combineReducers({
    [rootApi.reducerPath]: rootApi.reducer,
    user: UserSlice.reducer,
    users: UsersSlice.reducer,
    channel: ChannelSlice.reducer,
    textRoom: TextRoomSlice.reducer,
    message: MessageSlice.reducer,
    // room: roomSlice.reducer,
    // message: messageSlice.reducer,
    // member: memberSlice.reducer,
    // invitation: invitationSlice.reducer,
    // users: usersSlice.reducer,
    // modal: modalSlice.reducer,
    // appSettings: appSettingsSlice.reducer,
    // notification: notificationSlice.reducer,
    // privateChat: privateChatSlice.reducer,
    // role: roleSlice.reducer,
});