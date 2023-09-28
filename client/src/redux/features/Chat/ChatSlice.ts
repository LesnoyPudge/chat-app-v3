import { resetApiStateAction } from '@redux/globalReset';
import { RootState } from '@redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { Endpoints, ENTITY_NAMES } from '@shared';
import { AppSelectors, ChannelSelectors, ChatApi, PrivateChannelSelectors, RoleSelectors, RoomSelectors, UserSelectors } from '@redux/features';
import { createCustomizedEntityAdapter } from '@redux/utils';
import { SliceEntityState } from '@types';



const adapter = createCustomizedEntityAdapter<SliceEntityState.Chat>();

const initialState = adapter.getInitialState();

export const ChatSlice = createSlice({
    name: ENTITY_NAMES.CHAT,
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
            ChatApi.endpoints[Endpoints.V1.Chat.GetOne.ActionNameWithEntity].matchFulfilled,
            (state, { payload }) => {
                adapter.upsertOne(state, payload);
            },
        );
    },
});

const selectChatState = (state: RootState) => state.chat;

const adapterSelectors = adapter.customGetSelectors(selectChatState);

export const ChatSelectors = {
    ...adapterSelectors,
    selectChatState,

    selectHasAccessToRoomChat: (chatId?: string) => {
        return (state: RootState): boolean => {
            if (!chatId) return false;

            const me = AppSelectors.selectMe(state);
            if (!me) return false;

            const chat = ChatSelectors.selectById(chatId)(state);
            if (!chat) return false;

            if (chat.owner !== 'Room') return false;

            const room = RoomSelectors.selectById(chat.ownerId)(state);
            if (!room) return false;

            if (!room.isPrivate) return true;
            if (room.whiteList.users.includes(me.id)) return true;

            const isChannelOwner = ChannelSelectors.selectIsChannelOwner(room.channel)(state);
            if (isChannelOwner) return true;

            const roles = RoleSelectors.selectMyRolesByChannelId(room.channel)(state);
            const isRolesIntersect = roles.some((role) => {
                return room.whiteList.roles.includes(role.id);
            });
            if (isRolesIntersect) return true;

            const permissions = RoleSelectors.getMyPermissionsByChannelId(room.channel)(state);

            return (
                permissions.isAdministrator ||
                permissions.channelControl ||
                permissions.roomControl
            );
        };
    },
};