import { Reducer } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { combinedReducer } from './combinedReducer';
import { rootApi } from './rootApi';
import { cookies } from '@utils';
import { resetActionName } from './globalReset';




export const rootReducer: Reducer<RootState> = (state, action) => {
    if (action.type === resetActionName) {
        cookies.clear();
        return combinedReducer(state, rootApi.util.resetApiState());
    }

    return combinedReducer(state, action);
};