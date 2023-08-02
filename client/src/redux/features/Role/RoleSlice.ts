import { globalReset } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { RoleApi } from '@redux/features';



const adapter = createEntityAdapter<Entities.Role.Default>();

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

export const RoleSelectors = adapter.getSelectors((state: RootState) => state.role);