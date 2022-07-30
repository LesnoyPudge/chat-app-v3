import { IUser } from '@backendTypes';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';



const usersAdapter = createEntityAdapter<IUser>();

const initialState = usersAdapter.getInitialState();

export const UsersSlice = createSlice({
    name: 'users',
    initialState,           
    reducers: {
        reciveSubscription(state, { payload }: PayloadAction<IUser>) {
            usersAdapter.upsertOne(state, payload);
        },
        deleteUnsubscribedUser(state, { payload }: PayloadAction<string>) {
            usersAdapter.removeOne(state, payload);
        },
    },
});

export const {
    reciveSubscription,
    deleteUnsubscribedUser,

} = UsersSlice.actions;

export const {
    selectById: selectUsersById,
    selectIds: selectUsersIds,
    selectEntities: selectUsersEntities,
    selectAll: selectAllUsers,
    selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users);