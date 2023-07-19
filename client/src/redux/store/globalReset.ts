import { createAction } from '@reduxjs/toolkit';



export const resetActionName = 'triggerGlobalReset';

const action = createAction(resetActionName);

export const triggerGlobalReset = async() => {
    const { store } = await import('@redux/store');
    store.dispatch(action());
};

const type = 'api/resetApiState'; // type === rootApi.util.resetApiState().type

export const globalReset = createAction(type);