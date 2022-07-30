import { configureStore, ThunkAction, Action, AnyAction, Reducer } from '@reduxjs/toolkit';
import { rootApi } from '@redux/rootApi';
import { combinedReducer } from './combinedReducer';
import { getCookie, getLocalStorage, log } from '@utils';



const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === 'user/logout') {
        log('user/logout');
        getLocalStorage().clear();
        getCookie().removeAll();
        const apiState = state.api;
        state = {
            api: apiState,
        } as RootState;
    }

    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;