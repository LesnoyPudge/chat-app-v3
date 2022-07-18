import { configureStore, ThunkAction, Action, AnyAction, Reducer } from '@reduxjs/toolkit';
import rootApi from './rootApi';
import { combinedReducer } from './combinedReducer';



const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    // if (action?.payload?.status === 401) {
    //     console.log('unauth');
    //     // state = {} as RootState;
        
    if (action?.meta?.arg?.endpointName === 'userLogout') {
        console.log('userLogout');
        state = {} as RootState;
    }

    if (action.type === 'user/logout') {
        console.log('user/logout');
        state = {} as RootState;
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