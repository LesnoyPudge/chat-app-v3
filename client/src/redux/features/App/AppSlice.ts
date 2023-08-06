import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, Id, Timestamp } from '@shared';
import { UserApi, UserSelectors } from '@redux/features';
import { localStorageApi } from '@utils';
import { RootState } from '@redux/store';
import { globalReset, triggerGlobalReset } from '@redux/globalReset';




type AppState = {
    isInitialized: boolean;
    isRefreshing: boolean;
    myId: Id | null;
    lastRefresh: Timestamp | null;
    first: number;
    second: string;
};

const getInitialState = (): AppState => {
    return {
        isInitialized: false,
        isRefreshing: false,
        myId: null,
        lastRefresh: localStorageApi.get('lastRefresh'),
        first: 0,
        second: 'qwe',
    };
};

export const AppSlice = createSlice({
    name: 'App',
    initialState: getInitialState(),
    reducers: {
        refreshAuth: (state, { payload }: PayloadAction<Entities.User.WithoutCredentials>) => {
            state.isRefreshing = false;
            state.myId = payload.id;
            state.lastRefresh = Date.now();
            localStorageApi.set('lastRefresh', state.lastRefresh);
        },
        inc: (state) => {
            state.first += 1;
        },
        setText: (state, { payload }: PayloadAction<string>) => {
            state.second = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            localStorageApi.set('lastRefresh', null);

            return {
                ...getInitialState(),
                isInitialized: true,
            };
        });

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Login.ActionNameWithEntity].matchFulfilled,
            (state, data) => {
                AppSlice.caseReducers.refreshAuth(state, data);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Registration.ActionNameWithEntity].matchFulfilled,
            (state, data) => {
                AppSlice.caseReducers.refreshAuth(state, data);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Refresh.ActionNameWithEntity].matchPending,
            (state) => {
                state.isInitialized = true;
                state.isRefreshing = true;
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Refresh.ActionNameWithEntity].matchFulfilled,
            (state, data) => {
                AppSlice.caseReducers.refreshAuth(state, data);
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Refresh.ActionNameWithEntity].matchRejected,
            () => {
                triggerGlobalReset();
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Logout.ActionNameWithEntity].matchPending,
            () => {
                triggerGlobalReset();
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Delete.ActionNameWithEntity].matchFulfilled,
            () => {
                triggerGlobalReset();
            },
        );
    },
});

const selectAppState = (state: RootState) => state.app;

const selectIsAuthorized = (state: RootState) => !!selectAppState(state).myId;

const selectIsRefreshing = (state: RootState) => selectAppState(state).isRefreshing;

const selectIsInitialized = (state: RootState) => selectAppState(state).isInitialized;

const selectMe = (state: RootState) => {
    const id = selectAppState(state).myId;
    if (!id) return null;

    const user = UserSelectors.selectUserState(state).entities[id];
    if (!user) return null;

    return user as Entities.User.WithoutCredentials;
};

export const AppSelectors = {
    selectAppState,
    selectIsAuthorized,
    selectIsRefreshing,
    selectIsInitialized,
    selectMe,
};