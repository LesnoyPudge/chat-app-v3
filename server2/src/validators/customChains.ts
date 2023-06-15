import { ChannelServiceHelpers, ChatServiceHelpers, MessageServiceHelpers, PrivateChannelServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, UserServiceHelpers } from '@services';
import { Entities } from '@shared';
import { compare } from 'bcrypt';
import { FilterQuery } from 'mongoose';



export const customChains = {
    correctPassword(password: string, filter: FilterQuery<Entities.User.Default>) {
        return async() => {
            const user = await UserServiceHelpers.getOne(filter);

            if (!user) return Promise.reject();

            const isEqual = await compare(password, user.password);

            if (!isEqual) return Promise.reject('Неверный пароль');

            return Promise.resolve();
        };
    },

    inIncomingFriendRequests(userId: string, targetId: string) {
        return async() => {
            const user = await UserServiceHelpers.getOne({ id: userId });

            if (!user) return Promise.reject();

            const found = user.friendRequests.incoming.some((item) => {
                return item.from === targetId;
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    inOutgoingFriendRequests(userId: string, targetId: string) {
        return async() => {
            const user = await UserServiceHelpers.getOne({ id: userId });

            if (!user) return Promise.reject();

            const found = user.friendRequests.outgoing.some((item) => {
                return item.to === targetId;
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    inBlockList(userId: string, targetId: string) {
        return async() => {
            const user = await UserServiceHelpers.getOne({ id: userId });

            if (!user) return Promise.reject();

            const found = user.blocked.includes(targetId);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    inFriendList(userId: string, targetId: string) {
        return async() => {
            const user = await UserServiceHelpers.getOne({ id: userId });

            if (!user) return Promise.reject();

            const found = user.friends.includes(targetId);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    privateChannelMember(userId: string, privateChannelId: string) {
        return async() => {
            const privateChannel = await PrivateChannelServiceHelpers.getOne({ id: privateChannelId });

            if (!privateChannel) return Promise.reject();

            const found = privateChannel.members.includes(userId);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    validAccessCode(accessCode: string, filter: FilterQuery<Entities.User.Default>) {
        return async() => {
            const user = await UserServiceHelpers.getOne(filter);

            if (!user) return Promise.reject();

            const isEqual = user.accessCode.code === accessCode;
            const isExpired = user.accessCode.expiresAt < Date.now();

            if (!isEqual || isExpired) return Promise.reject();

            return Promise.resolve();
        };
    },

    channelMember(userId: string, channelId: string) {
        return async() => {
            const target = await ChannelServiceHelpers.getOne({ id: channelId });

            if (!target) return Promise.reject();

            const found = target.members.includes(userId);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    validInvitationCode(code: string, channelId: string) {
        return async() => {
            const channel = await ChannelServiceHelpers.getOne({ id: channelId });

            if (!channel) return Promise.reject();

            const invitation = channel.invitations.find((item) => {
                return item.code === code;
            });

            if (!invitation) return Promise.reject();

            if (
                invitation.expiresAt && 
                invitation.expiresAt < Date.now()
            ) return Promise.reject();

            return Promise.resolve();
        };
    },

    invitationExists(code: string, channelId: string) {
        return async() => {
            const channel = await ChannelServiceHelpers.getOne({ id: channelId });

            if (!channel) return Promise.reject();

            const found = channel.invitations.some((item) => {
                return item.code === code;
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    inBanList(userId: string, channelId: string) {
        return async() => {
            const channel = await ChannelServiceHelpers.getOne({ id: channelId });

            if (!channel) return Promise.reject();

            const found = channel.banned.some((item) => {
                return item.user === userId;
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    channelOwner(userId: string, channelId: string) {
        return async() => {
            const channel = await ChannelServiceHelpers.isExist({ id: channelId, owner: userId });

            if (!channel) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionAdministrator(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.isAdministrator === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionBan(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.banMember === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    oneOf(chains: ((value: any) => Promise<void>)[]) {
        return async(value?: unknown) => {
            const results = await Promise.all(chains.map(async(chain) => {
                return await chain(value)
                    .then(() => true)
                    .catch(() => false);
            }));

            const found = results.some((item) => item === true);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionCreateInvitation(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.createInvitation === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionKick(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.kickMember === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    not(chain: (value: any) => Promise<void>) {
        return async(value: unknown) => {
            const success = await chain(value).then(() => true).catch(() => false);

            if (success) return Promise.reject();

            return Promise.resolve();
        };
    },

    all(chains: ((value: any) => Promise<void>)[]) {
        return async(value: unknown) => {
            const results = await Promise.all(chains.map(async(chain) => {
                return await chain(value)
                    .then(() => true)
                    .catch(() => false);
            }));

            const found = results.some((item) => item === false);

            if (found) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionChannel(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.channelControl === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    privateRoom(roomId: string) {
        return async() => {
            const exists = await RoomServiceHelpers.isExist({ id: roomId, isPrivate: true });
            
            if (!exists) return Promise.reject();

            return Promise.resolve();
        };
    },

    inRoomWhiteList(userId: string, roomId: string) {
        return async() => {
            const room = await RoomServiceHelpers.getOne({ id: roomId });

            if (!room) return Promise.reject();

            const foundUser = room.whiteList.users.includes(userId);

            if (foundUser) return Promise.resolve();

            const roles = await RoleServiceHelpers.getMany({ channel: room.channel });

            const foundRole = roles.some((role) => {
                return (
                    role.users.includes(userId) &&
                    room.whiteList.roles.includes(role.id)
                );
            });

            if (!foundRole) return Promise.reject();

            return Promise.resolve();
        };
    },

    permissionRoom(userId: string, channelId: string) {
        return async() => {
            const roles = await RoleServiceHelpers.getMany({ channel: channelId });

            const found = roles.some((role) => {
                return (
                    role.permissions.roomControl === true && 
                    role.users.some((id) => id === userId)
                );
            });

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    privateChannelAlreadyExists(userId: string, targetId: string) {
        return async() => {
            const exists = await PrivateChannelServiceHelpers.isExist({
                members: { $all: [userId, targetId] },
            });
        
            if (!exists) return Promise.reject();

            return Promise.resolve();
        };
    },

    roleMember(userId: string, roleId: string) {
        return async() => {
            const role = await RoleServiceHelpers.getOne({ id: roleId });

            if (!role) return Promise.reject();

            const found = role.users.includes(userId);

            if (!found) return Promise.reject();

            return Promise.resolve();
        };
    },

    roleExists(roleId: string, channelId: string) {
        return async() => {
            const channel = await ChannelServiceHelpers.getOne({ id: channelId });

            if (!channel) return Promise.reject();

            const found = channel.roles.includes(roleId);

            if (!found) return Promise.reject();
            
            return Promise.resolve();
        };
    },

    ableToReadMessage(userId: string, messageId: string) {
        return async() => {
            const message = await MessageServiceHelpers.getOne({ id: messageId });
            if (!message) return Promise.reject();
            
            const privateChannel = await PrivateChannelServiceHelpers.getOne({ 
                chat: message.chat,
                members: { $in: [userId] }, 
            });
            if (privateChannel) return Promise.resolve();

            const room = await RoomServiceHelpers.getOne({ chat: message.chat });
            if (!room) return Promise.reject();

            const channel = await ChannelServiceHelpers.getOne({ 
                rooms: { $in: [room.id] },
                members: { $in: [userId] },
            });
            if (!channel) return Promise.reject();

            if (!room.isPrivate) return Promise.resolve();

            const haveAccess = await (this.oneOf([
                this.permissionAdministrator(userId, channel.id),
                this.permissionRoom(userId, channel.id),
                this.channelOwner(userId, channel.id),
                this.inRoomWhiteList(userId, room.id),
            ])()).then(() => true).catch(() => false);

            if (haveAccess) return Promise.resolve();

            return Promise.reject();
        };
    },

    ableToModifyMessage(userId: string, messageId: string) {
        return async() => {
            const haveAccess = await this.ableToReadMessage(
                userId,
                messageId,
            )().then(() => true).catch(() => false);
            if (!haveAccess) return Promise.reject();

            const message = await MessageServiceHelpers.getOne({ 
                id: messageId, 
            });
            if (!message) return Promise.reject();

            if (message.user === userId) return Promise.resolve();

            return Promise.reject();
        };
    },

    ableToDeleteMessage(userId: string, messageId: string) {
        return async() => {
            const haveAccess = await this.ableToReadMessage(
                userId,
                messageId,
            )().then(() => true).catch(() => false);
            if (!haveAccess) return Promise.reject();

            const message = await MessageServiceHelpers.getOne({ 
                id: messageId, 
            });
            if (!message) return Promise.reject();

            if (message.user === userId) return Promise.resolve();

            const room = await RoomServiceHelpers.getOne({ 
                chat: message.chat, 
            });
            if (!room) return Promise.reject();

            const permissionToDelete = await this.oneOf([
                this.channelOwner(userId, room.channel),
                this.permissionAdministrator(userId, room.channel),
            ])().then(() => true).catch(() => false);

            if (permissionToDelete) return Promise.resolve();

            return Promise.reject();
        };
    },

    attachmentExists(fileId: string, messageId: string) {
        return async() => {
            const message = await MessageServiceHelpers.getOne({
                id: messageId,
            });
            if (!message) return Promise.reject();

            const found = message.attachments.some((item) => {
                return item.id === fileId;
            });
            if (found) return Promise.resolve();

            return Promise.reject();
        };
    },

    ableToCreateMessage(userId: string, chatId: string) {
        return async() => {
            const privateChannel = await PrivateChannelServiceHelpers.getOne({ 
                chat: chatId,
                members: { $in: [userId] }, 
            });
            if (privateChannel) return Promise.resolve();

            const room = await RoomServiceHelpers.getOne({ chat: chatId });
            if (!room) return Promise.reject();

            const channel = await ChannelServiceHelpers.getOne({ 
                rooms: { $in: [room.id] },
                members: { $in: [userId] },
            });
            if (!channel) return Promise.reject();

            if (!room.isPrivate) return Promise.resolve();

            const haveAccess = await (this.oneOf([
                this.permissionAdministrator(userId, channel.id),
                this.permissionRoom(userId, channel.id),
                this.channelOwner(userId, channel.id),
                this.inRoomWhiteList(userId, room.id),
            ])()).then(() => true).catch(() => false);

            if (haveAccess) return Promise.resolve();

            return Promise.reject();
        };
    },

    ableToGetChat(userId: string, chatId: string) {
        return async() => {
            const chat = await ChatServiceHelpers.getOne({ id: chatId });
            if (!chat) return Promise.reject();

            if (chat.room !== null) {
                const room = await RoomServiceHelpers.getOne({ id: chat.room });
                if (!room) return Promise.reject();

                return customChains.channelMember(userId, room.channel)();
            }

            return customChains.privateChannelMember(userId, chat.privateChannel)();
        };
    },
};