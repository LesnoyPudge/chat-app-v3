import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { rootApi } from '@redux/rootApi';
import { combinedReducer } from './combinedReducer';
import { rootReducer } from './rootReducer';



export const store = configureStore<RootState>({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof combinedReducer>;

export type WithRootState = {
    state: RootState;
}

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;