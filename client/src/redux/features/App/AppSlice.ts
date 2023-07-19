import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
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
};

const getInitialState = (): AppState => {
    return {
        isInitialized: false,
        isRefreshing: false,
        myId: null,
        lastRefresh: localStorageApi.get('lastRefresh'),
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

const selectIsAuthorized = createSelector([selectAppState], (state) => !!state.myId);

const selectMyId = createSelector([selectAppState], (state) => state.myId);

const selectMe = createSelector(
    [UserSelectors.selectUserState, selectMyId],
    (users, id) => {
        if (!id) return null;

        const user = users.entities[id];
        if (!user) return null;

        return user as Entities.User.WithoutCredentials;
    },
);

const selectIsInitialized = createSelector([selectAppState], (state) => state.isInitialized);

const selectIsRefreshing = createSelector([selectAppState], (state) => state.isRefreshing);

export const AppSelectors = {
    selectAppState,
    selectIsAuthorized,
    selectMyId,
    selectMe,
    selectIsInitialized,
    selectIsRefreshing,
};