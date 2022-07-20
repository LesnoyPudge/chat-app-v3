import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserApi from './UserApi';
import { IAuthResponse, IUser } from '@backendTypes/*';
import { getLocalStorage } from 'src/utils';
import { RootState } from 'src/redux/store';



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
        logout() {/* handling in store */},
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            UserApi.endpoints.userRefresh.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.info = payload.user;
                state.isAuth = true;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userRegistration.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.info = payload.user;
                state.isAuth = true;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userLogin.matchFulfilled,
            (state, { payload }: PayloadAction<IAuthResponse>) => {
                state.info = payload.user;
                state.isAuth = true;
                getLocalStorage().set('token', payload.accessToken);
            },
        );
        builder.addMatcher(
            UserApi.endpoints.userSome.matchFulfilled,
            () => {
                console.log('works!!!');
            },
        );
    },
});

export const {
    logout,

} = UserSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectUserInfo = (state: RootState) => state.user.info;