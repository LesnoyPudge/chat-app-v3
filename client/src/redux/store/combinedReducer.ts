import { combineReducers } from '@reduxjs/toolkit';
import { ChannelSlice, RoomSlice, UserSlice, UsersSlice, MessageSlice, PrivateChannelSlice } from '@redux/features';
import { rootApi } from '@redux/rootApi';



export const combinedReducer = combineReducers({
    [rootApi.reducerPath]: rootApi.reducer,
    user: UserSlice.reducer,
    users: UsersSlice.reducer,
    channel: ChannelSlice.reducer,
    room: RoomSlice.reducer,
    message: MessageSlice.reducer,
    privateChannel: PrivateChannelSlice.reducer,
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