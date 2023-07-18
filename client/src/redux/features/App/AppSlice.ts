import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, Id, Timestamp } from '@shared';
import { UserApi, UserSelectors } from '@redux/features';
import { localStorageApi } from '@utils';
import { RootState } from '@redux/store';
import { globalReset } from '@redux/globalReset';



type AppState = {
    isInitialized: boolean;
    myid: Id | null;
    lastRefresh: Timestamp | null;
};

const getInitialState = (): AppState => {
    return {
        isInitialized: false,
        myid: null,
        lastRefresh: localStorageApi.get('lastRefresh'),
    };
};

export const AppSlice = createSlice({
    name: 'App',
    initialState: getInitialState(),
    reducers: {
        triggerGlobalReset: () => {
            // store => globalReset
        },

        refreshAuth: (state, { payload }: PayloadAction<Entities.User.WithoutCredentials>) => {
            state.myid = payload.id;
            state.lastRefresh = Date.now();
            localStorageApi.set('lastRefresh', state.lastRefresh);
        },
    },
    extraReducers(builder) {
        builder.addCase(globalReset, (state) => {
            localStorageApi.set('lastRefresh', null);
            Object.assign(state, {
                ...getInitialState(),
                isInitialized: true,
            });
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
                if (state.isInitialized) return;
                state.isInitialized = true;
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
                AppSlice.caseReducers.triggerGlobalReset();
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Logout.ActionNameWithEntity].matchPending,
            () => {
                AppSlice.caseReducers.triggerGlobalReset();
            },
        );

        builder.addMatcher(
            UserApi.endpoints[Endpoints.V1.User.Delete.ActionNameWithEntity].matchFulfilled,
            () => {
                AppSlice.caseReducers.triggerGlobalReset();
            },
        );
    },
});

const selectAppState = (state: RootState) => state.app;

const selectIsAuthorized = createSelector([selectAppState], (state) => !!state.myid);

const selectMyId = createSelector([selectAppState], (state) => state.myid);

const selectMe = createSelector(
    [UserSelectors.selectUserState, selectMyId],
    (users, id) => {
        if (!id) return null;

        const user = users.entities[id];
        if (!user) return null;

        return user as Entities.User.WithoutCredentials;
    },
);


export const AppSelectors = {
    selectAppState,
    selectIsAuthorized,
    selectMyId,
    selectMe,
};