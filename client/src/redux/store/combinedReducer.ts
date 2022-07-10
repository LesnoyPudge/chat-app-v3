import { combineReducers } from '@reduxjs/toolkit';
import rootApi from './rootApi';



export const combinedReducer = combineReducers({
    [rootApi.reducerPath]: rootApi.reducer,
    // user: userSlice.reducer,
    // channel: channelSlice.reducer,
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