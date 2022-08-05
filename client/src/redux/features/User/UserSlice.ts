import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorage, log, socket } from '@utils';
import { IUser, IAuthResponse } from '@backendTypes';
import { UserApi } from './UserApi';
import { RootState } from '@redux/store';



interface IUserState {
    info: IUser;
    isAuth: boolean;
}

const UserInitialState: IUserState = {
    info: {} as IUser,
    isAuth: false,
};

export const UserSlice = createSlice({
    name: 'user',
    initialState: UserInitialState,
    reducers: {
        login(state, { payload }: PayloadAction<IAuthResponse>) {
            state.info = payload.user;
            state.isAuth = true;
            getLocalStorage().set('token', payload.accessToken);
        },

        logout() {/* handling in store/store.ts/rootReducer */},

        joinRoom(state, { payload }: PayloadAction<string | string[]>) {
            socket.events.user.joinRooms(payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            UserApi.endpoints.userRefresh.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                UserSlice.reducer(state, login(payload));
                UserSlice.reducer(state, joinRoom(payload.user.id));
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRegistration.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                UserSlice.reducer(state, login(payload));
                UserSlice.reducer(state, joinRoom(payload.user.id));
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogin.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                UserSlice.reducer(state, login(payload));
                UserSlice.reducer(state, joinRoom(payload.user.id));
            },
        );
    },
});

export const {
    login,
    logout,
    joinRoom,

} = UserSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectUserInfo = (state: RootState) => state.user.info;