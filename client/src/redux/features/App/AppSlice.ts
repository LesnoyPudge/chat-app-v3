import { CaseReducer, createEntityAdapter, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { firstLetterUppercase, objectKeys } from '@utils';
import { Endpoints, Entities, ENTITY_NAMES, Id, Prettify, StrictExtract, StrictOmit, ValueOf } from '@shared';



type AppState = {
    isInitialized: boolean;
} & ({
    isAuthorized: false;
    me: null;
} | {
    isAuthorized: true;
    me: Id;
});

type ActionNames = StrictExtract<
    ValueOf<typeof Endpoints.V1.User>['ActionName'], 
    'login' | 'logout' | 'refresh' | 'registration'
> | 'authToggle';

type Reducers = Record<ActionNames, CaseReducer<AppState, PayloadAction<void>>>;

const initialState: AppState = {
    isInitialized: false,
    isAuthorized: false,
    me: null,
};

export const AppSlice = createSlice<AppState, Reducers>({
    name: 'App',
    initialState,           
    reducers: {
        authToggle: (state) => {
            console.log('authToggle');
            state.isAuthorized = !state.isAuthorized;
        },

        login: (state) => {
            console.log('login');
            state.isAuthorized = true;
            state.isInitialized = true;
            state.me = 'myId123';
        },

        logout: (state) => {
            console.log('logout');
            state.isAuthorized = false;
            state.isInitialized = true;
            state.me = null;
        },

        refresh: () => {

        },

        registration: () => {

        },
    }, 
    extraReducers(builder) {
    },
});

export const {
    login,
    logout,
} = AppSlice.actions;