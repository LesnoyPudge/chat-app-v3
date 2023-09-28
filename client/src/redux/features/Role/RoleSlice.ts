import { resetApiStateAction } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, Entities, ENTITY_NAMES } from '@shared';
import { AppSelectors, ChannelSelectors, RoleApi } from '@redux/features';
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
        builder.addCase(resetApiStateAction, () => {
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

    selectByChannelId: (channelId: string) => {
        return (state: RootState) => {
            const roleIds = ChannelSelectors.selectById(channelId)(state)?.roles;
            if (!roleIds) return [];

            return RoleSelectors.selectByIds(roleIds)(state);
        };
    },

    selectMyRoles: (state: RootState) => {
        const { myId } = AppSelectors.selectAppState(state);
        if (!myId) return [];

        return RoleSelectors.selectAll(state).filter((role) => {
            return role.users.includes(myId);
        });
    },

    selectMyRolesByChannelId: (channelId: string) => {
        return (state: RootState) => {
            const { myId } = AppSelectors.selectAppState(state);
            if (!myId) return [];

            const roles = RoleSelectors.selectByChannelId(channelId)(state);

            return roles.filter((role) => {
                return role.users.includes(myId);
            });
        };
    },

    getMyPermissionsByChannelId: (channelId: string) => {
        return (state: RootState): SliceEntityState.Role['permissions'] => {
            const roles = RoleSelectors.selectMyRolesByChannelId(channelId)(state);

            const getPermission = (permission: keyof SliceEntityState.Role['permissions']) => {
                return roles.some((role) => role.permissions[permission] === true);
            };

            return {
                banMember: getPermission('banMember'),
                channelControl: getPermission('channelControl'),
                createInvitation: getPermission('createInvitation'),
                isAdministrator: getPermission('isAdministrator'),
                kickMember: getPermission('kickMember'),
                roomControl: getPermission('roomControl'),
            };
        };
    },
};