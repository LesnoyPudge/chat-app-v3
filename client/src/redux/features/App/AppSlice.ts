import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, Id, Timestamp, defaultAvatar } from '@shared';
import { UserApi, UserSelectors } from '@redux/features';
import { localStorageApi } from '@utils';
import { RootState } from '@redux/store';
import { resetApiStateAction, triggerGlobalReset } from '@redux/globalReset';




type AppState = {
    isInitialized: boolean;
    isRefreshing: boolean;
    isInternetConnected: boolean;
    isSocketConnected: boolean;
    myId: Id | null;
    lastRefresh: Timestamp | null;
    muted: boolean;
    deaf: boolean;
};

const getInitialState = (): AppState => {
    return {
        isInitialized: false,
        isRefreshing: false,
        isInternetConnected: navigator.onLine,
        isSocketConnected: false,
        myId: null,
        lastRefresh: localStorageApi.get('lastRefresh'),
        muted: false,
        deaf: false,
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
            localStorageApi.set('myId', state.myId);
        },

        toggleMute: (state) => {
            state.muted = !state.muted;
        },

        toggleDeaf: (state) => {
            state.deaf = !state.deaf;
        },

        setIsInternetConnected: (state, { payload }: PayloadAction<boolean>) => {
            state.isInternetConnected = payload;
        },

        setIsSocketConnected: (state, { payload }: PayloadAction<boolean>) => {
            state.isSocketConnected = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(resetApiStateAction, () => {
            localStorageApi.removeSensitive();

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

const selectIsOnline = (state: RootState) => {
    const { isInternetConnected, isSocketConnected } = selectAppState(state);

    return isInternetConnected && isSocketConnected;
};

const userDummy: Entities.User.WithoutCredentials = {
    id: String(Math.floor(Math.random() * 100_000)),
    avatarId: defaultAvatar.getRandomAvatar(),
    blocked: [],
    channels: [],
    createdAt: Date.now(),
    email: null,
    extraStatus: 'default',
    friendRequests: {
        incoming: [],
        outgoing: [],
    },
    friends: [],
    isActivated: false,
    isDeleted: false,
    login: String(Math.floor(Math.random() * 100_000)),
    privateChannels: [],
    settings: {
        fontSize: 16,
        messageGroupSpacing: 16,
        theme: 'auto',
    },
    username: 'dummy user',
    status: 'offline',
};

const selectMe = (state: RootState): Entities.User.WithoutCredentials => {
    const id = selectAppState(state).myId;
    if (!id) {
        console.error('Unauthorized user selector');
        return userDummy;
    }

    const user = UserSelectors.selectUserState(state).entities[id];
    if (!user) {
        console.error('Unauthorized user selector');
        return userDummy;
    }

    return user as Entities.User.WithoutCredentials;
};

export const AppSelectors = {
    selectAppState,
    selectIsAuthorized,
    selectMe,
    selectIsOnline,
};