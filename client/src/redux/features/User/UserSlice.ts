import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserApi from './UserApi';
import { IAuthResponse, IUser } from '@backendTypes/*';
import { getLocalStorage } from 'src/utils';
import { RootState } from 'src/redux/store';



interface IUserState {
    info: IUser;
    isAuth: boolean;
    isInit: boolean;
    isLoading: boolean;
}

const initialState: IUserState = {
    info: {} as IUser,
    isAuth: false,
    isInit: false,
    isLoading: false,
};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        notAuthorized(state) {
            state.isInit = true;
            state.isLoading = false;
            state.isAuth = false;
        },
        logout() {
            getLocalStorage().clear();
        },
        setAccessToken(state, { payload }: PayloadAction<string>) {
            getLocalStorage().set('token', payload);
        },
        initiate(state) {
            state.isInit = true;
            state.isLoading = true;
        }, 
    },
    extraReducers: (builder) => {
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
                state.info = payload.user;
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
                state.isInit = true;
                getLocalStorage().clear();
                // return initialState;
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRegistration.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.info = payload.user;
                state.isAuth = true;
                state.isInit = true;
                state.isLoading = false;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogin.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.info = payload.user;
                state.isInit = true;
                state.isAuth = true;
                state.isLoading = false;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogout.matchFulfilled,
            () => {
                getLocalStorage().clear();
            },
        );
    },
});

export const {
    notAuthorized,
    logout,
    setAccessToken,
    initiate,

} = UserSlice.actions;

export const getUser = (state: RootState) => state.user;
export const getUserInfo = (state: RootState) => state.user.info;