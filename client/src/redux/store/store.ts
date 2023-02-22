import { configureStore, ThunkAction, Action, AnyAction, Reducer } from '@reduxjs/toolkit';
import { rootApi } from '@redux/rootApi';
import { combinedReducer } from './combinedReducer';
import { getCookie, getLocalStorage, log } from '@utils';



const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    const isLogoutReducer = action.type === 'user/logout';
    const isLogoutMutation = action?.meta?.arg?.endpointName === 'userLogout';
    const isLogoutMutationPending = isLogoutMutation && action.type === 'api/executeMutation/pending';
    const isLogoutMutationRejected = isLogoutMutation && action.type === 'api/executeMutation/rejected';
    const isLogoutMutationFulfilled = isLogoutMutation && action.type === 'api/executeMutation/fulfilled';
    
    if (isLogoutReducer || isLogoutMutationFulfilled || isLogoutMutationRejected) {
        log('user logout');
        getLocalStorage().clear();
        getCookie().removeAll();
        const apiState = state.api;
        state = {
            api: apiState,
        } as RootState;
    }

    if (isLogoutMutationPending) {
        log('prepare to logout');
        const apiState = state.api;
        state = {
            api: apiState,
        } as RootState;
    }

    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;