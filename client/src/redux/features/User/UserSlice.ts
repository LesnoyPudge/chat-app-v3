import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserApi from './UserApi';
import { IAuthResponse } from '@backendTypes/*';
import { getLocalStorage } from 'src/utils';



interface IUserState {
    // userInfo: IUser;
    userInfo: any;
    isAuth: boolean;
    isInit: boolean;
    isLoading: boolean;
}

const initialState: IUserState = {
    userInfo: {
        id: '',
        avatar: '',
        identifier: '',
        login: '',
        username: '',
        password: '',
        email: '',
        isActivated: false,
        membership: [],
        friends: [],
        privateChats: [],
        hiddenPrivateChats: [],
        blockList: [],
    },
    isAuth: false,
    isInit: false,
    isLoading: false,
};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            UserApi.endpoints.userRegistration.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.userInfo = payload.user;
                state.isAuth = true;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRefresh.matchPending,
            (state) => {
                state.isInit = true;
                state.isLoading = true;
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRefresh.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.userInfo = payload.user;
                state.isAuth = true;
                state.isLoading = false;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRefresh.matchRejected,
            (state) => {
                state.isAuth = false;
                state.isLoading = false;
                getLocalStorage().clear();
                return initialState;
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogout.matchFulfilled,
            () => {
                getLocalStorage().clear();
                return initialState;
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogin.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.userInfo = payload.user;
                state.isInit = true;
                state.isAuth = true;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
    },
});

export const {

} = UserSlice.actions;