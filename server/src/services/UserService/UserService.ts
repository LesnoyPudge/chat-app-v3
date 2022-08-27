import { UserDto } from '@dtos';
import { UserModel } from '@models';
import { IGetOneUserRequest, IUser, ILoginUserRequest, IRegistrationUserRequest, ServiceType, AuthorizedServiceType, IGetManyUserRequest, IUpdateUserRequest, IAuthResponse, IBlockUserRequest, IUnblockUserRequest, ISendFriendRequestUserRequest, IAcceptFriendRequestUserRequest, IDeclineFriendRequestUserRequest, IRevokeFriendRequestUserRequest, IDeleteFriendUserRequest, IActivateAccountUserRequest, IChangeAvatarUserRequest, IChangePasswordUserRequest, IChangeExtraStatusUserRequest, IVerifyAccessCodeUserReuqest } from '@types';
import { transactionContainer, ApiError, token, createAccessCode, objectId, date, sendMail, password, getRandomString } from '@utils';
import { subscription } from '@subscription';
import { UserServiceHelpers, AttachmentServiceHelpers } from '@services';



interface IUserService {
    registration: ServiceType<IRegistrationUserRequest, IAuthResponse>;
    login: ServiceType<ILoginUserRequest, IAuthResponse>;
    logout: ServiceType<{refreshToken: string}, void>;
    refresh: ServiceType<{refreshToken: string}, IAuthResponse>;
    getOne: AuthorizedServiceType<IGetOneUserRequest, IUser>;
    // getMany: AuthorizedServiceType<IGetManyUserRequest, IUser[]>;
    update: AuthorizedServiceType<IUpdateUserRequest, IUser>;
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
    changeAvatar: AuthorizedServiceType<IChangeAvatarUserRequest, IUser>;
    changePassword: AuthorizedServiceType<IChangePasswordUserRequest, void>;
    changeExtraStatus: AuthorizedServiceType<IChangeExtraStatusUserRequest, IUser>;
    verifyAccessCode: AuthorizedServiceType<IVerifyAccessCodeUserReuqest, void>;
}

const { toObjectId } = objectId;
const { isExpired } = date;
const { sendAccessCode, sendActivationLink } = sendMail;
const { hashPassword, isPasswordsEquals } = password;
const { getUUID } = getRandomString;

export const UserService: IUserService = {
    async registration({ email, login, password, username }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const hashedPassword = await hashPassword(password);
                const activationCode = getUUID();
                const { code, expiryDate } = createAccessCode();
                const attachment = await AttachmentServiceHelpers.getDefaultUserAvatar();

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
                ).then((users) => users[0]).catch(() => {
                    throw ApiError.badRequest('Не удалось зарегистрироваться');
                });

                const tokens = token.generateTokens(UserDto.objectFromModel(user));
                
                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось зарегистрироваться');
                });

                onCommit(() => {
                    if (email) sendActivationLink({ username, email, activationCode }).catch((error) => {
                        console.log('Не удалось отправить письмо', error.message);
                    });
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
                if (!user) {
                    throw ApiError.badRequest('Неверный логин или пароль');
                }

                const isCorrectPassword = await isPasswordsEquals({ password, hashedPassword: user.password });
                if (!isCorrectPassword) {
                    throw ApiError.badRequest('Неверный логин или пароль');
                }

                const tokens = token.generateTokens(UserDto.objectFromModel(user));

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось войти');
                });

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
        console.log(`targetId: ${targetId}, user: ${user}`);
        // if (!user) throw ApiError.badRequest('Пользователь не найден to delete');

        return UserDto.objectFromModel(user);
    },

    // async getMany({ userId, targetIds }) {
    //     const users = await UserModel.find(
    //         { _id: { $in: targetIds } }, 
    //         {}, 
    //         { lean: true },
    //     );
    //     if (users.length === 0) {
    //         throw ApiError.badRequest('Пользователи не найдены');
    //     }

    //     const usersDto = users.map((user) => {
    //         return UserDto.objectFromModel(user);
    //     });

    //     return usersDto;
    // },

    async update({ userId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    newValues, 
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest();
                });

                const updatedUserDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async delete({ userId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                await UserModel.deleteOne({ _id: userId }, queryOptions());
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
                
                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось заблокировать пользователя');
                });

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
                const isAccessCodeExpired = isExpired(user.accessCode.expiryDate);
                const hasEmail = !!user.email;
                const isActivated = user.isActivated;

                if (!hasEmail) throw ApiError.badRequest('Не указан адрес электронной почты');
                if (!isActivated) throw ApiError.badRequest('Аккаунт не активирован');
                if (!isAccessCodeExpired) {
                    return sendAccessCode({ to: user.email, code: user.accessCode.code }).catch(() => {
                        throw ApiError.badRequest('Не удалось отправить код доступа');
                    });
                }
                
                const { code, expiryDate } = createAccessCode();

                user.accessCode = {
                    code,
                    expiryDate,
                };

                await user.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить код доступа');
                });

                await sendAccessCode({ to: user.email, code }).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить код доступа');
                });
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

                userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
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

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось принять запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
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

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отклонить запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
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

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отозвать запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
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
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async requestActivationLink({ userId }) {
        const user = await UserModel.findById(userId, {}, { lean: true });
        if (!user) {
            throw ApiError.badRequest('Пользователь не найден');
        }
        const hasEmail = !!user.email;
        const isActivated = user.isActivated;

        if (!hasEmail) throw ApiError.badRequest('Не указан адрес электронной почты');
        if (isActivated) throw ApiError.badRequest('Аккаунт уже активирован');

        await sendActivationLink({
            username: user.username, 
            email: user.email, 
            activationCode: user.activationCode,
        }).catch(() => {
            throw ApiError.badRequest('Не удалось отправить письмо с ссылкой для активации');
        }); 
    },

    async activateAccount({ activationCode }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { activationCode },
                    { $set: { isActivated: true } }, 
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось активировать пользователя');
                });

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });
            },
        );
    },

    async changeAvatar({ userId, filename, base64url }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId);

                const oldAvatarId = userToUpdate.avatar;

                await AttachmentServiceHelpers.delete({ attachmentId: oldAvatarId });
                
                const isNoNewAvatar = !filename || !base64url;
                if (isNoNewAvatar) {
                    const defaultAvatar = await AttachmentServiceHelpers.getDefaultUserAvatar();
                    
                    userToUpdate.avatar = defaultAvatar.id;
                    
                    const updatedUserDto = UserDto.objectFromModel(userToUpdate);
                    
                    onCommit(() => {
                        subscription.users.update({ entity: updatedUserDto });
                    });

                    return updatedUserDto;
                }

                const newAvatar = await AttachmentServiceHelpers.create({ base64url, filename });
                
                userToUpdate.avatar = newAvatar.id;

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);
                    
                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async changePassword({ userId, newPassword, oldPassord }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const userToUpdate = await UserModel.findById(userId);
                
                const isValidPassword = isPasswordsEquals({ password: oldPassord, hashedPassword: userToUpdate.password });
                if (!isValidPassword) {
                    throw ApiError.badRequest('Неверный пароль');
                }

                const hashedPassword = await hashPassword(newPassword);

                userToUpdate.password = hashedPassword;
                await userToUpdate.save(queryOptions());
            },
        );
    },

    async changeExtraStatus({ userId, extraStatus }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    { $set: { extraStatus: extraStatus } },
                    queryOptions(),
                );

                const updatedUserDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async verifyAccessCode({ userId, accessCode }) {
        const user = await UserModel.findById(userId, {}, { lean: true });

        const isCodesEqual = user.accessCode.code === accessCode;
        const isCodeExpired = isExpired(user.accessCode.expiryDate);

        if (!isCodesEqual) {
            throw ApiError.badRequest('Неверный код доступа');
        }
        
        if (isCodeExpired) {
            throw ApiError.badRequest('Срок действия кода доступа истёк');
        }
    },
};