import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Entities, ENTITY_NAMES } from '@shared';



type UserState = Entities.User.Preview | Entities.User.WithoutCredentials;

const adapter = createEntityAdapter<UserState>();

const initialState = adapter.getInitialState();

export const UserSlice = createSlice({
    name: ENTITY_NAMES.USER,
    initialState,           
    reducers: {
        upsertOne: (state, { payload }: PayloadAction<UserState>) => {
            adapter.upsertOne(state, payload);
        },
    }, 
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });
    },
});

const selectUserState = (state: RootState) => state.user;

export const UserSelectors = {
    ...adapter.getSelectors(selectUserState),
    selectUserState,
};