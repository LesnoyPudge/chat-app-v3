import { UserDto } from '@dtos';
import { UserModel } from '@models';
import { IGetOneUserRequest, IUser, ILoginUserRequest, IRegistrationUserRequest, ServiceType, AuthorizedServiceType, IAuthResponse, IBlockUserRequest, IUnblockUserRequest, ISendFriendRequestUserRequest, IAcceptFriendRequestUserRequest, IDeclineFriendRequestUserRequest, IRevokeFriendRequestUserRequest, IDeleteFriendUserRequest, IActivateAccountUserRequest, IVerifyAccessCodeUserReuqest, IProfileUpdateUserRequest, ICredentialsUpdateUserRequest } from '@types';
import { transactionContainer, ApiError, token, createAccessCode, objectId, date, sendMail, password, getRandomString } from '@utils';
import { subscription } from '@subscription';
import { UserServiceHelpers, FileServiceHelpers } from '@services';



interface IUserService {
    registration: ServiceType<IRegistrationUserRequest, IAuthResponse>;
    login: ServiceType<ILoginUserRequest, IAuthResponse>;
    logout: ServiceType<{refreshToken: string}, void>;
    refresh: ServiceType<{refreshToken: string}, IAuthResponse>;
    getOne: AuthorizedServiceType<IGetOneUserRequest, IUser>;
    update: AuthorizedServiceType<IProfileUpdateUserRequest, IUser>;
    credentialsUpdate: AuthorizedServiceType<ICredentialsUpdateUserRequest, IUser>;
    delete: AuthorizedServiceType<unknown, void>;
    blockUser: AuthorizedServiceType<IBlockUserRequest, IUser>;
    unblockUser: AuthorizedServiceType<IUnblockUserRequest, IUser>;
    requestAccessCode: AuthorizedServiceType<unknown, void>;
    sendFriendRequest: AuthorizedServiceType<ISendFriendRequestUserRequest, IUser>;
    acceptFriendRequest: AuthorizedServiceType<IAcceptFriendRequestUserRequest, IUser>;
    declineFriendRequest: AuthorizedServiceType<IDeclineFriendRequestUserRequest, IUser>;
    revokeFriendRequest: AuthorizedServiceType<IRevokeFriendRequestUserRequest, IUser>;
    deleteFriend: AuthorizedServiceType<IDeleteFriendUserRequest, IUser>;
    requestActivationLink: AuthorizedServiceType<unknown, void>;
    activateAccount: ServiceType<IActivateAccountUserRequest, void>;
}

const { toObjectId } = objectId;
const { sendAccessCode, sendActivationLink } = sendMail;
const { hashPassword } = password;
const { getUUID } = getRandomString;

export const UserService: IUserService = {
    async registration({ email, login, password, username }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const hashedPassword = await hashPassword(password);
                const activationCode = getUUID();
                const { code, expiryDate } = createAccessCode();
                const attachment = await FileServiceHelpers.getDefaultUserAvatar();

                const user = await UserModel.create(
                    [{
                        avatar: attachment.id,
                        email,
                        login,
                        password: hashedPassword,
                        username,
                        activationCode,
                        accessCode: {
                            code,
                            expiryDate,
                        },
                    }],
                    queryOptions(),
                ).then((users) => users[0]);

                const tokens = token.generateTokens(UserDto.objectFromModel(user));
                
                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                onCommit(() => {
                    if (email) sendActivationLink({ username, email, activationCode });
                });

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );
    },

    async login({ login, password }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findOne({ login });
                const tokens = token.generateTokens({ id: user._id.toString() });

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );  
    },

    async logout({ refreshToken }) {
        return transactionContainer(
            async({ queryOptions }) => {
                await UserModel.updateOne(
                    { refreshJWT: refreshToken },
                    { refreshJWT: '' },
                    queryOptions(),
                );
            },
        );
    },

    async refresh({ refreshToken }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const jwtData = token.validateRefreshToken(refreshToken);
                if (!jwtData) {
                    throw ApiError.forbidden();
                }

                const user = await UserModel.findOne(
                    { 
                        _id: jwtData.id, 
                        refreshJWT: refreshToken, 
                    },
                );
                if (!user) {
                    throw ApiError.forbidden();
                }

                const tokens = token.generateTokens(UserDto.objectFromModel(user));

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );
    },

    async getOne({ userId, targetId }) {
        const user = await UserModel.findById(targetId, {}, { lean: true });
        return UserDto.objectFromModel(user);
    },

    async update({ userId, avatar, extraStatus, settings, username }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                const isntEmptyAvatar = avatar && avatar.filename && avatar.base64url;
                const isEmptyAvatar = avatar && !avatar.filename || !avatar.base64url;

                if (extraStatus) userToUpdate.extraStatus = extraStatus;
                if (settings) userToUpdate.settings = Object.assign(userToUpdate.settings, settings);
                if (username) userToUpdate.username = username;

                if (avatar) await FileServiceHelpers.delete({ attachmentId: userToUpdate.avatar });
                if (isEmptyAvatar) {
                    const defaultAvatar = await FileServiceHelpers.getDefaultUserAvatar();
                    userToUpdate.avatar = defaultAvatar.id;
                }
                if (isntEmptyAvatar) {
                    const newAvatar = await FileServiceHelpers.create({
                        type: 'avatar',
                        base64url: avatar.base64url, 
                        filename: avatar.filename,
                    });
                    userToUpdate.avatar = newAvatar.id;
                }

                await userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async credentialsUpdate({ userId, newEmail, newLogin, newPassword }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                
                if (newEmail) userToUpdate.email = newEmail;
                if (newLogin) userToUpdate.login = newLogin;
                if (newPassword) {
                    const hashedPassword = await hashPassword(newPassword);
                    userToUpdate.password = hashedPassword;
                }

                await userToUpdate.save(queryOptions());

                return UserDto.objectFromModel(userToUpdate);
            },
        );
    },

    async delete({ userId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const deletedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    { $set: { isDeleted: true } }, 
                    queryOptions({ new: true }),
                );
                
                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(deletedUser), type: 'public' });
                });
            },
        );
    },

    async blockUser({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friends = userToUpdate.friends.filter((friend) => {
                    return friend !== toObjectId(targetId);
                });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(targetId);
                });

                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(targetId);
                });

                await UserServiceHelpers.removeFriend({ userId: targetId, targetId: userId });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: targetId, from: userId });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: targetId, to: userId });

                userToUpdate.blockList.push(toObjectId(targetId));
                
                await userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async unblockUser({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { blockList: targetId } },
                    queryOptions({ new: true }),
                );

                const userDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: userDto });
                });

                return userDto;
            },
        );
    },

    async requestAccessCode({ userId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findById(userId, {}, { lean: true });
                if (!user.email) throw ApiError.badRequest('Не указан адрес электронной почты');

                const { code, expiryDate } = createAccessCode();

                user.accessCode = { code, expiryDate };

                await user.save(queryOptions());
                
                await sendAccessCode({ to: user.email, code });
            },
        );
    },

    async sendFriendRequest({ userId, to }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.outgoing.push({
                    to: toObjectId(to),
                    createdAt: new Date(),
                });

                await UserServiceHelpers.addIncomingFriendRequest({ userId: to, from: userId });

                userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto, type: 'private' });
                });

                return updatedUserDto;
            },
        );
    },

    async acceptFriendRequest({ userId, from }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(from);
                });
                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(from);
                });
                userToUpdate.friends.push(toObjectId(from));

                await UserServiceHelpers.addFriend({ userId: from, targetId: userId });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: from, to: userId });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: from, from: userId });

                await userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto, type: 'private' });
                });

                return updatedUserDto;
            },
        );
    },

    async declineFriendRequest({ userId, from }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(from);
                });

                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: from, to: userId });

                await userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto, type: 'private' });
                });

                return updatedUserDto;
            },
        );
    },

    async revokeFriendRequest({ userId, to }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(to);
                });

                await UserServiceHelpers.removeIncomingFriendRequest({ userId: to, from: userId });

                await userToUpdate.save(queryOptions());

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto, type: 'private' });
                });

                return updatedUserDto;
            },
        );
    },

    async deleteFriend({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { friends: targetId } },
                    queryOptions({ new: true }),
                );

                await UserServiceHelpers.removeFriend({ userId: targetId, targetId: userId });

                const updatedUserDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto, type: 'private' });
                });

                return updatedUserDto;
            },
        );
    },

    async requestActivationLink({ userId }) {
        const user = await UserModel.findById(userId, {}, { lean: true });
        const hasEmail = !!user.email;
        const isActivated = user.isActivated;

        if (!hasEmail) throw ApiError.badRequest('Не указан адрес электронной почты');
        if (isActivated) throw ApiError.badRequest('Аккаунт уже активирован');

        await sendActivationLink({
            username: user.username, 
            email: user.email, 
            activationCode: user.activationCode,
        }); 
    },

    async activateAccount({ activationCode }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { activationCode },
                    { $set: { isActivated: true } }, 
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser), type: 'private' });
                });
            },
        );
    },
};