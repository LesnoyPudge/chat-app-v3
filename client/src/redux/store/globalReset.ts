import { createAction } from '@reduxjs/toolkit';



export const triggerGlobalResetAction = createAction('triggerGlobalReset');

export const triggerGlobalReset = async() => {
    const { store } = await import('@redux/store');
    store.dispatch(triggerGlobalResetAction());
};

export const resetApiStateAction = createAction('api/resetApiState'); // rootApi.util.resetApiState().type