import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { RoleApi } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { SliceEntityState } from '@types';



const adapter = createCustomizedEntityAdapter<SliceEntityState.Role>();

const initialState = adapter.getInitialState();

export const RoleSlice = createSlice({
    name: ENTITY_NAMES.ROLE,
    initialState,
    reducers: {
        upsertOne: adapter.upsertOne,
        removeOne: adapter.removeOne,
    },
    extraReducers(builder) {
        builder.addCase(globalReset, () => {
            return initialState;
        });

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.AddMember.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.Create.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.Delete.ActionNameWithEntity].matchFulfilled,
            (state, { meta }) => {
                adapter.removeOne(state, meta.arg.originalArgs.roleId);
            },
        );

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.RemoveMember.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );

        builder.addMatcher(
            RoleApi.endpoints[Endpoints.V1.Role.Update.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

const selectRoleState = (state: RootState) => state.role;

const adapterSelectors = adapter.customGetSelectors(selectRoleState);

export const RoleSelectors = {
    ...adapterSelectors,
    selectRoleState,
};