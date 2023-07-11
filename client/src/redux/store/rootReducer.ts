import { Reducer } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { combinedReducer } from './combinedReducer';



export const rootReducer: Reducer<RootState> = (state, action) => {
    // console.log(action);

    // const isGlobalReset = action.type === 'App/globalReset';
    // if (isGlobalReset) {
    //     store.dispatch(globalReset());
    // }

    // const isLogoutReducer = action.type === 'user/logout';
    // const isLogoutMutation = action?.meta?.arg?.endpointName === 'userLogout';
    // const isLogoutMutationPending = isLogoutMutation && action.type === 'api/executeMutation/pending';
    // const isLogoutMutationRejected = isLogoutMutation && action.type === 'api/executeMutation/rejected';
    // const isLogoutMutationFulfilled = isLogoutMutation && action.type === 'api/executeMutation/fulfilled';
    
    // if (isLogoutReducer || isLogoutMutationFulfilled || isLogoutMutationRejected) {
    //     log('user logout');
    //     // getLocalStorage().clear();
        
    //     const apiState = state.api;
    //     state = {
    //         api: apiState,
    //     } as RootState;
    // }

    // if (isLogoutMutationPending) {
    //     log('prepare to logout');
    //     const apiState = state.api;
    //     state = {
    //         api: apiState,
    //     } as RootState;
    // }

    return combinedReducer(state, action);
};