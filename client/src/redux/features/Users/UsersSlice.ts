import { IUser } from '@backendTypes';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { socketEvents } from '@socket';



const usersAdapter = createEntityAdapter<IUser>();

const initialState = usersAdapter.getInitialState();

export const UsersSlice = createSlice({
    name: 'users',
    initialState,           
    reducers: {
        subscribeOnUser(state, { payload }: PayloadAction<string>) {
            socketEvents.user.subscribe(payload);
        },
        unsubscribeFromUser(state, { payload }: PayloadAction<string>) {
            socketEvents.user.unsubscribe(payload);
            usersAdapter.removeOne(state, payload);
        },
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
    subscribeOnUser,
    unsubscribeFromUser,

} = UsersSlice.actions;

export const {
    selectById: selectUsersById,
    selectIds: selectUsersIds,
    selectEntities: selectUsersEntities,
    selectAll: selectAllUsers,
    selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users);