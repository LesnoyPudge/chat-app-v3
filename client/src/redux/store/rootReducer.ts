import { Reducer } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { combinedReducer } from './combinedReducer';
import { cookies, localStorageApi } from '@utils';
import { resetApiStateAction, triggerGlobalResetAction } from '@redux/globalReset';



const triggerType = triggerGlobalResetAction().type;

export const rootReducer: Reducer<RootState> = (state, action) => {
    if (action.type === triggerType) {
        cookies.clear();
        localStorageApi.clear();

        return combinedReducer(state, resetApiStateAction());
    }

    return combinedReducer(state, action);
};