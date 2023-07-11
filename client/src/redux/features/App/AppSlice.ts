import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Id, Timestamp } from '@shared';
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
            UserApi.endpoints.UserRefresh.matchPending,
            (state) => {
                if (state.isInitialized) return;
                state.isInitialized = true;
            },
        );

        builder.addMatcher(
            UserApi.endpoints.UserRefresh.matchFulfilled,
            (state, { payload }) => {
                state.myid = payload.id;
                state.lastRefresh = Date.now();
                localStorageApi.set('lastRefresh', state.lastRefresh);
            },
        );

        builder.addMatcher(
            UserApi.endpoints.UserRefresh.matchRejected,
            (state) => {
                state.myid = null;
                state.lastRefresh = null;
                localStorageApi.set('lastRefresh', state.lastRefresh);
            },
        );
    },
});

const selectAppState = (state: RootState) => state.app;

const selectIsAuthorized = createSelector([selectAppState], (state) => !!state.myid);

const selectMyId = createSelector([selectAppState], (state) => state.myid);

const selectMe = createSelector(
    [UserSelectors.selectUserState, selectMyId], 
    (users, id) => id ? users.entities[id] : null,
);


export const AppSelectors = {
    selectAppState,
    selectIsAuthorized,
    selectMyId,
    selectMe,
};