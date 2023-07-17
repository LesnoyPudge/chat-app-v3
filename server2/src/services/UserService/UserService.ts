import { UserDTO } from '@dto';
import { modelWithId, transactionContainer, UserModel } from '@database';
import { UserServiceHelpers, FileServiceHelpers } from '@services';
import { defaultAvatar, Endpoints, StrictOmit, Tokens, UserWithTokens } from '@shared';
import { AuthorizedService, Service } from '@types';
import { createAccessCode, hashPassword, token } from '@utils';
import { randomUUID } from 'crypto';
import { ApiError } from '@errors';
import { emails } from '@emails';
import { UserSubscription } from '@subscription';



interface UserService {
    [Endpoints.V1.User.Registration.ActionName]: Service<
        Endpoints.V1.User.Registration.RequestBody,
        UserWithTokens<Endpoints.V1.User.Registration.Response>
    >;
    [Endpoints.V1.User.Login.ActionName]: Service<
        Endpoints.V1.User.Login.RequestBody,
        UserWithTokens<Endpoints.V1.User.Login.Response>
    >;
    [Endpoints.V1.User.Refresh.ActionName]: Service<
        Endpoints.V1.User.Refresh.RequestBody & Pick<Tokens, 'refreshToken'>,
        StrictOmit<UserWithTokens<Endpoints.V1.User.Refresh.Response>, 'refreshToken'>
    >;
    [Endpoints.V1.User.GetOne.ActionName]: AuthorizedService<
        Endpoints.V1.User.GetOne.RequestBody,
        Endpoints.V1.User.GetOne.Response
    >;
    [Endpoints.V1.User.ProfileUpdate.ActionName]: AuthorizedService<
        Endpoints.V1.User.ProfileUpdate.RequestBody,
        Endpoints.V1.User.ProfileUpdate.Response
    >;
    [Endpoints.V1.User.CredentialsUpdate.ActionName]: AuthorizedService<
        Endpoints.V1.User.CredentialsUpdate.RequestBody,
        Endpoints.V1.User.CredentialsUpdate.Response
    >;
    [Endpoints.V1.User.Delete.ActionName]: AuthorizedService<
        Endpoints.V1.User.Delete.RequestBody,
        Endpoints.V1.User.Delete.Response
    >;
    [Endpoints.V1.User.Block.ActionName]: AuthorizedService<
        Endpoints.V1.User.Block.RequestBody,
        Endpoints.V1.User.Block.Response
    >;
    [Endpoints.V1.User.Unblock.ActionName]: AuthorizedService<
        Endpoints.V1.User.Unblock.RequestBody,
        Endpoints.V1.User.Unblock.Response
    >;
    [Endpoints.V1.User.RequestAccessCode.ActionName]: AuthorizedService<
        Endpoints.V1.User.RequestAccessCode.RequestBody,
        Endpoints.V1.User.RequestAccessCode.Response
    >;
    [Endpoints.V1.User.VerifyAccessCode.ActionName]: AuthorizedService<
        Endpoints.V1.User.VerifyAccessCode.RequestBody,
        Endpoints.V1.User.VerifyAccessCode.Response
    >;
    [Endpoints.V1.User.SendFriendRequest.ActionName]: AuthorizedService<
        Endpoints.V1.User.SendFriendRequest.RequestBody,
        Endpoints.V1.User.SendFriendRequest.Response
    >;
    [Endpoints.V1.User.AcceptFriendRequest.ActionName]: AuthorizedService<
        Endpoints.V1.User.AcceptFriendRequest.RequestBody,
        Endpoints.V1.User.AcceptFriendRequest.Response
    >;
    [Endpoints.V1.User.DeclineFriendRequest.ActionName]: AuthorizedService<
        Endpoints.V1.User.DeclineFriendRequest.RequestBody,
        Endpoints.V1.User.DeclineFriendRequest.Response
    >;
    [Endpoints.V1.User.RevokeFriendRequest.ActionName]: AuthorizedService<
        Endpoints.V1.User.RevokeFriendRequest.RequestBody,
        Endpoints.V1.User.RevokeFriendRequest.Response
    >;
    [Endpoints.V1.User.DeleteFriend.ActionName]: AuthorizedService<
        Endpoints.V1.User.DeleteFriend.RequestBody,
        Endpoints.V1.User.DeleteFriend.Response
    >;
    [Endpoints.V1.User.HidePrivateChannel.ActionName]: AuthorizedService<
        Endpoints.V1.User.HidePrivateChannel.RequestBody,
        Endpoints.V1.User.HidePrivateChannel.Response
    >;
}

export const UserService: UserService = {
    async registration({ email, login, password, username }) {
        return transactionContainer(
            async({ session }) => {
                const hashedPassword = await hashPassword(password);
                const activationCode = randomUUID();
                const { code, expiresAt } = createAccessCode();
                const avatar = defaultAvatar.getRandomAvatar();

                const createdUser = modelWithId(new UserModel({
                    avatar: avatar.name,
                    email,
                    login,
                    password: hashedPassword,
                    username,
                    activationCode,
                    accessCode: {
                        code,
                        expiresAt,
                    },
                }));

                const tokens = token.generateTokens(UserDTO.token(createdUser));

                createdUser.refreshToken = tokens.refreshToken;

                const user = await createdUser.save({ session });

                return {
                    user: UserDTO.withoutCredentials(user),
                    ...tokens,
                };
            },
        );
    },

    async login({ login }) {
        return transactionContainer(
            async({ session }) => {
                const user = await UserModel.findOne({ login });

                if (!user) throw ApiError.internal();

                const tokens = token.generateTokens(UserDTO.token(user));

                const tokenData = token.validateRefreshToken(user.refreshToken);
                if (!tokenData) {
                    user.refreshToken = tokens.refreshToken;
                    await user.save({ session });
                }

                return {
                    user: UserDTO.withoutCredentials(user),
                    accessToken: tokens.accessToken,
                    refreshToken: !tokenData ? tokens.refreshToken : user.refreshToken,
                };
            },
        );
    },

    async refresh({ refreshToken }) {
        const tokenData = token.validateRefreshToken(refreshToken);
        if (!tokenData) throw ApiError.unauthorized();

        const user = await UserModel.findOne({ id: tokenData.id }).lean();
        if (!user) throw ApiError.unauthorized();

        const { accessToken } = token.generateTokens(UserDTO.token(user));

        return {
            user: UserDTO.withoutCredentials(user),
            accessToken,
        };
    },

    async getOne(_, { targetId }) {
        const user = await UserModel.findOne({ id: targetId }).lean();
        if (!user) throw ApiError.internal();

        return UserDTO.withoutCredentials(user);
    },

    async profileUpdate({ id }, { avatar, ...newValues }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const partiallyUpdatedUser = await UserModel.findOneAndUpdate(
                    { id }, newValues, { new: true },
                ).session(session);

                if (!partiallyUpdatedUser) throw ApiError.internal();

                const isNewAvatarProvided = avatar !== undefined;

                if (isNewAvatarProvided) {
                    await FileServiceHelpers.delete(partiallyUpdatedUser.avatar);
                }

                if (isNewAvatarProvided && avatar === null) {
                    const newAvatar = defaultAvatar.getRandomAvatar();
                    partiallyUpdatedUser.avatar = newAvatar.name;
                }

                if (isNewAvatarProvided && avatar !== null) {
                    const newAvatar = await FileServiceHelpers.create(avatar);
                    partiallyUpdatedUser.avatar = newAvatar.id;
                }

                const updatedUser = await partiallyUpdatedUser.save({ session });

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(updatedUser);
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async credentialsUpdate({ id }, { newEmail, newLogin, newPassword }) {
        return transactionContainer(
            async({ session }) => {
                if (newPassword) {
                    newPassword = await hashPassword(newPassword);
                }

                const updatedUser = await UserModel.findOneAndUpdate(
                    { id },
                    {
                        password: newPassword,
                        email: newEmail,
                        login: newLogin,
                    },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async delete({ id }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id },
                    { isDeleted: true },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(updatedUser);
                });
            },
        );
    },

    async block({ id }, { targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const userToUpdate = await UserModel.findOne({ id });

                if (!userToUpdate) throw ApiError.internal();

                await UserServiceHelpers.removeFriend({ userId: id, targetId });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: id, targetId });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: id, targetId });

                await UserServiceHelpers.removeFriend({ userId: targetId, targetId: id });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: targetId, targetId: id });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: targetId, targetId: id });

                userToUpdate.blocked.push(targetId);

                const updatedUser = await userToUpdate.save({ session });

                onCommit(() => {
                    UserSubscription.update(updatedUser);
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async unblock({ id }, { targetId }) {
        return transactionContainer(
            async({ session, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { id },
                    { $pull: { blocked: targetId } },
                    { new: true },
                ).session(session).lean();

                if (!updatedUser) throw ApiError.internal();

                onCommit(() => {
                    UserSubscription.update(updatedUser);
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async requestAccessCode({ id }) {
        return transactionContainer(
            async({ session }) => {
                const accessCode = createAccessCode();

                const user = await UserModel.findOneAndUpdate(
                    { id }, accessCode, { new: true },
                ).session(session).lean();

                if (!user || !user.email) throw ApiError.internal();

                await emails.sendAccessCode({
                    email: user.email,
                    code: accessCode.code,
                });
            },
        );
    },

    async sendFriendRequest({ id }, { targetId }) {
        return transactionContainer(
            async() => {
                await UserServiceHelpers.addIncomingFriendRequest({
                    userId: targetId,
                    targetId: id,
                });

                const updatedUser = await UserServiceHelpers.addOutgoingFriendRequest({
                    userId: id,
                    targetId,
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async acceptFriendRequest({ id }, { targetId }) {
        return transactionContainer(
            async() => {
                await UserServiceHelpers.addFriend({ userId: id, targetId });
                await UserServiceHelpers.addFriend({ userId: targetId, targetId: id });

                await UserServiceHelpers.removeOutgoingFriendRequest({
                    userId: targetId,
                    targetId: id,
                });
                const updatedUser = await UserServiceHelpers.removeIncomingFriendRequest({
                    userId: id,
                    targetId,
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async declineFriendRequest({ id }, { targetId }) {
        return transactionContainer(
            async() => {
                await UserServiceHelpers.removeOutgoingFriendRequest({
                    userId: targetId,
                    targetId: id,
                });
                const updatedUser = await UserServiceHelpers.removeIncomingFriendRequest({
                    userId: id,
                    targetId,
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async revokeFriendRequest({ id }, { targetId }) {
        return transactionContainer(
            async() => {
                await UserServiceHelpers.removeIncomingFriendRequest({
                    userId: targetId,
                    targetId: id,
                });
                const updatedUser = await UserServiceHelpers.removeOutgoingFriendRequest({
                    userId: id,
                    targetId,
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async deleteFriend({ id }, { targetId }) {
        return transactionContainer(
            async() => {
                await UserServiceHelpers.removeFriend({
                    userId: targetId,
                    targetId: id,
                });

                const updatedUser = await UserServiceHelpers.removeFriend({
                    userId: id,
                    targetId,
                });

                return UserDTO.withoutCredentials(updatedUser);
            },
        );
    },

    async verifyAccessCode({ id }, { accessCode }) {
        const user = await UserModel.findOne({ id });

        if (!user) throw ApiError.internal();
        if (user.accessCode.code !== accessCode) throw ApiError.badRequest();
    },

    async hidePrivateChannel({ id }, { privateChannelId }) {
        const updatedUser = await UserServiceHelpers.changePrivateChannelHiddenState({
            userId: id,
            privateChannelId,
            hidden: true,
        });

        return UserDTO.withoutCredentials(updatedUser);
    },
};