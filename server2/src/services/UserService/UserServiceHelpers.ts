import { UserDTO } from '@dto';
import { FilterQuery } from 'mongoose';
import { transactionContainer, UserModel } from '@database';
import { ApiError } from '@errors';
import { Entities, WithChannelId, WithPrivateChannelId, WithTargetId, WithUserId } from '@shared';
import { UserSubscription } from '@subscription';



export const UserServiceHelpers = {
    async addChannel({ userId, channelId }: WithUserId & WithChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id: userId },
                    { $push: { channels: channelId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removeChannel({ userId, channelId }: WithUserId & WithChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id: userId },
                    { $pull: { channels: channelId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removeChannelFromMany({ channelId }: WithChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const usersToUpdate = await UserModel.find({ channels: channelId });

                const updatedUsers = await Promise.all(usersToUpdate.map(async(user) => {
                    user.channels = user.channels.filter((itemId) => itemId !== channelId);

                    const updatedUser = await user.save({ session });

                    onCommit(() => {
                        UserSubscription.update(
                            updatedUser,
                            [updatedUser.id],
                            UserDTO.withoutCredentials,
                        );
                    });

                    return updatedUser;
                }));

                return updatedUsers;
            },
        );
    },

    async addPrivateChannel({ userId, privateChannelId }: WithUserId & WithPrivateChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id: userId },
                    { $push: { privateChannels: {
                        id: privateChannelId,
                        hidden: false,
                    } } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removePrivateChannel({ userId, privateChannelId }: WithUserId & WithPrivateChannelId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOne({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                userToUpdate.privateChannels = userToUpdate.privateChannels.filter((item) => {
                    return item.id !== privateChannelId;
                });

                const updatedUser = await userToUpdate.save({ session });

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async addFriend({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id: userId },
                    { $push: { friends: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removeFriend({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id: userId },
                    { $pull: { friends: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async addIncomingFriendRequest({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOneAndUpdate({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                userToUpdate.friendRequests.incoming.push({
                    from: targetId,
                    createdAt: Date.now(),
                });

                const updatedUser = await userToUpdate.save({ session });

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removeIncomingFriendRequest({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOne({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== targetId;
                });

                const updatedUser = await userToUpdate.save({ session });

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async addOutgoingFriendRequest({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOne({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                userToUpdate.friendRequests.outgoing.push({
                    to: targetId,
                    createdAt: Date.now(),
                });

                const updatedUser = await userToUpdate.save({ session });

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async removeOutgoingFriendRequest({ userId, targetId }: WithUserId & WithTargetId) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOne({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== targetId;
                });

                const updatedUser = await userToUpdate.save({ session });

                onCommit(() => {
                    UserSubscription.update(
                        updatedUser,
                        [updatedUser.id],
                        UserDTO.withoutCredentials,
                    );
                });

                return updatedUser;
            },
        );
    },

    async isUserExist(filter: FilterQuery<Entities.User.Default>) {
        return !!await UserModel.exists(filter).lean();
    },

    async getOne(filter: FilterQuery<Entities.User.Default>) {
        return await UserModel.findOne(filter).lean();
    },

    async isUsersExists(filter: FilterQuery<Entities.User.Default>) {
        return await UserModel.find(filter, 'id').lean();
    },

    async changePrivateChannelHiddenState(
        { hidden, privateChannelId, userId }: WithUserId & WithPrivateChannelId & {hidden: boolean},
    ) {
        return transactionContainer(
            async({ session }) => {
                const userToUpdate = await UserModel.findOne({ id: userId });

                if (!userToUpdate) throw ApiError.internal();

                const index = userToUpdate.privateChannels.findIndex((item) => item.id === privateChannelId);
                userToUpdate.privateChannels[index].hidden = hidden;

                const updatedUser = await userToUpdate.save({ session });

                return updatedUser;
            },
        );
    },
};